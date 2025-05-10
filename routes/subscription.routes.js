
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const PromoCode = require('../models/PromoCode');
const { protect } = require('../middleware/auth');

// Get current subscription
router.get('/current', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ 
      user: req.user._id,
      status: { $in: ['active', 'trialing'] }
    });
    
    if (!subscription) {
      return res.json({ subscription: null, plan: 'free' });
    }
    
    res.json({ subscription, plan: subscription.plan });
  } catch (error) {
    console.error('Get current subscription error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create checkout session
router.post('/create-checkout-session', protect, async (req, res) => {
  try {
    const { priceId, promoCode } = req.body;
    
    // Validate price ID
    const validPriceIds = [
      'price_basic_monthly', 
      'price_basic_yearly',
      'price_pro_monthly',
      'price_pro_yearly'
    ];
    
    if (!validPriceIds.includes(priceId)) {
      return res.status(400).json({ error: 'Invalid price ID' });
    }
    
    // Get or create customer
    let customerId;
    const customerSearch = await stripe.customers.list({
      email: req.user.email,
      limit: 1
    });
    
    if (customerSearch.data.length > 0) {
      customerId = customerSearch.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: {
          userId: req.user._id.toString()
        }
      });
      customerId = customer.id;
    }
    
    // Set up checkout session parameters
    const sessionParams = {
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/dashboard?success=true`,
      cancel_url: `${req.headers.origin}/pricing?canceled=true`,
      metadata: {
        userId: req.user._id.toString()
      }
    };
    
    // Apply promo code if provided
    if (promoCode) {
      // Validate and apply promo code
      const promo = await PromoCode.findOne({ code: promoCode.toUpperCase() });
      
      if (promo && new Date(promo.expiresAt) > new Date()) {
        if (promo.maxUses === null || promo.timesUsed < promo.maxUses) {
          // Create a coupon in Stripe if it doesn't exist
          let coupon;
          try {
            coupon = await stripe.coupons.retrieve(`PROMO_${promo.code}`);
          } catch (err) {
            coupon = await stripe.coupons.create({
              id: `PROMO_${promo.code}`,
              percent_off: promo.discount,
              duration: 'once'
            });
          }
          
          // Apply the coupon to the session
          sessionParams.discounts = [{ coupon: coupon.id }];
          
          // Increment the times used
          await PromoCode.findByIdAndUpdate(promo._id, { $inc: { timesUsed: 1 } });
        }
      }
    }
    
    // Create the checkout session
    const session = await stripe.checkout.sessions.create(sessionParams);
    
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create portal session
router.post('/create-portal-session', protect, async (req, res) => {
  try {
    // Get customer ID
    const subscription = await Subscription.findOne({ user: req.user._id });
    
    if (!subscription) {
      return res.status(400).json({ error: 'No active subscription found' });
    }
    
    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${req.headers.origin}/dashboard`
    });
    
    res.json({ url: session.url });
  } catch (error) {
    console.error('Create portal session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody || req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      
      // Handle the checkout session completion
      try {
        if (session.mode === 'subscription' && session.metadata.userId) {
          // Get subscription details from Stripe
          const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription);
          
          // Determine the subscription tier based on the price
          let plan = 'basic';
          const priceId = stripeSubscription.items.data[0].price.id;
          
          if (priceId.includes('pro')) {
            plan = 'pro';
          }
          
          // Create or update subscription in our database
          await Subscription.findOneAndUpdate(
            { user: session.metadata.userId },
            {
              user: session.metadata.userId,
              stripeCustomerId: session.customer,
              stripeSubscriptionId: session.subscription,
              plan: plan,
              status: stripeSubscription.status,
              usageLimit: plan === 'basic' ? 5000 : 50000, // Set limits based on plan
              expiresAt: new Date(stripeSubscription.current_period_end * 1000),
              updatedAt: new Date()
            },
            { upsert: true, new: true }
          );
        }
      } catch (error) {
        console.error('Error processing checkout session:', error);
      }
      break;
    }
    
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      
      try {
        // Find the user with this subscription
        const userSubscription = await Subscription.findOne({
          stripeSubscriptionId: subscription.id
        });
        
        if (userSubscription) {
          // Update subscription status
          userSubscription.status = subscription.status;
          userSubscription.expiresAt = new Date(subscription.current_period_end * 1000);
          userSubscription.updatedAt = new Date();
          
          await userSubscription.save();
        }
      } catch (error) {
        console.error('Error processing subscription update:', error);
      }
      break;
    }
  }
  
  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});

module.exports = router;
