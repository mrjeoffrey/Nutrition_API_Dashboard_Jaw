
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  const plans = {
    free: {
      title: "Free",
      price: "$0",
      description: "Perfect for testing and small projects",
      features: [
        "100 API requests per day",
        "Basic food database access",
        "Standard response time",
        "Community support",
      ],
      cta: "Get Started"
    },
    basic: {
      title: "Basic",
      price: billingCycle === 'monthly' ? "$29" : "$290",
      description: "For growing applications and businesses",
      features: [
        "10,000 API requests per month",
        "Full food database access",
        "Barcode scanning capability",
        "Priority support",
        "Basic analytics dashboard"
      ],
      cta: "Subscribe Now",
      popular: true
    },
    pro: {
      title: "Pro",
      price: billingCycle === 'monthly' ? "$99" : "$990",
      description: "For enterprise-grade applications",
      features: [
        "100,000 API requests per month",
        "Full food database access",
        "Barcode scanning capability",
        "Premium support with SLA",
        "Advanced analytics dashboard",
        "Custom endpoints",
        "Dedicated environment"
      ],
      cta: "Contact Sales"
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Header */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your needs. All plans include access to our API and developer tools.
          </p>
          
          {/* Billing Toggle */}
          <div className="mt-8">
            <Tabs 
              defaultValue="monthly" 
              value={billingCycle}
              onValueChange={(value) => setBillingCycle(value as 'monthly' | 'yearly')}
              className="w-full max-w-md mx-auto"
            >
              <TabsList className="grid grid-cols-2 w-[400px]">
                <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
                <TabsTrigger value="yearly">
                  Yearly Billing
                  <span className="ml-1.5 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                    Save 20%
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>
      
      {/* Plans */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard 
              title={plans.free.title}
              price={plans.free.price}
              description={plans.free.description}
              features={plans.free.features}
              cta={plans.free.cta}
              tier="free"
            />
            
            <PricingCard 
              title={plans.basic.title}
              price={plans.basic.price}
              description={plans.basic.description}
              features={plans.basic.features}
              cta={plans.basic.cta}
              popular={plans.basic.popular}
              tier="basic"
            />
            
            <PricingCard 
              title={plans.pro.title}
              price={plans.pro.price}
              description={plans.pro.description}
              features={plans.pro.features}
              cta={plans.pro.cta}
              tier="pro"
            />
          </div>
        </div>
      </section>
      
      {/* FAQs */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">What happens if I exceed my API limit?</h3>
              <p className="text-gray-600">
                If you exceed your plan's API limit, additional requests will be charged at a per-request rate. You can also upgrade your plan at any time to increase your limit.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Can I change plans later?</h3>
              <p className="text-gray-600">
                Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes will take effect at the start of your next billing cycle.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Do you offer custom plans?</h3>
              <p className="text-gray-600">
                Yes, for enterprise customers with specific needs, we offer custom plans with tailored features and API limits. Contact our sales team to learn more.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">How accurate is your nutrition data?</h3>
              <p className="text-gray-600">
                Our data comes from the USDA Food Data Central database and is regularly updated to ensure accuracy. For branded foods, we work with manufacturers to provide the most up-to-date information.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Is there a free trial for paid plans?</h3>
              <p className="text-gray-600">
                We offer a 14-day free trial for all paid plans. You can explore all features and API capabilities before making a commitment.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Pricing;
