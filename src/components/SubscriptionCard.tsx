
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const SubscriptionCard = () => {
  const { subscription, token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleManageSubscription = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await axios.post('/api/subscriptions/create-portal-session');
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Failed to create portal session:', error);
      toast.error('Failed to open subscription management portal');
    } finally {
      setLoading(false);
    }
  };

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>You don't have an active subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-gray-500 mb-4">Subscribe to get access to our premium features</p>
          </div>
        </CardContent>
        <CardFooter>
          <Link to="/pricing" className="w-full">
            <Button className="w-full">View Plans</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  const usagePercentage = (subscription.usageCount / subscription.usageLimit) * 100;
  const expiryDate = new Date(subscription.expiresAt);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>Your current subscription details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Plan</span>
            <span className="font-medium capitalize">{subscription.tier}</span>
          </div>
          <div className="flex justify-between">
            <span>Status</span>
            <span className="text-green-600 font-medium">Active</span>
          </div>
          <div className="flex justify-between">
            <span>Expires</span>
            <span>{format(expiryDate, 'MMM d, yyyy')}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>API Usage</span>
            <span>
              {subscription.usageCount} / {subscription.usageLimit} requests
            </span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex space-x-2 w-full">
          <Link to="/pricing" className="w-full">
            <Button variant="outline" className="w-full">Upgrade</Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleManageSubscription}
            disabled={loading || subscription.tier === 'free'}
          >
            {loading ? 'Loading...' : 'Manage'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;
