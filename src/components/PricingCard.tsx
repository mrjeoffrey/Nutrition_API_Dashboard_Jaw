
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  tier: 'free' | 'basic' | 'pro';
}

const PricingCard = ({
  title,
  price,
  description,
  features,
  cta,
  popular = false,
  tier
}: PricingCardProps) => {
  const { user, subscription } = useAuth();
  const isCurrentPlan = subscription?.tier === tier;

  return (
    <div className={`relative ${popular ? 'scale-105 z-10' : 'z-0'}`}>
      {popular && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <span className="bg-brand-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      <div className={`
        flex flex-col p-6 mx-auto max-w-lg text-center rounded-lg border shadow
        ${popular ? 'border-brand-600 shadow-lg' : 'border-gray-200 shadow-sm'}
        ${isCurrentPlan ? 'ring-2 ring-brand-600' : ''}
      `}>
        {isCurrentPlan && (
          <div className="absolute top-6 right-6">
            <span className="bg-brand-100 text-brand-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Current Plan
            </span>
          </div>
        )}

        <h3 className="mb-4 text-2xl font-semibold">{title}</h3>
        <div className="flex justify-center items-baseline my-8">
          <span className="text-5xl font-extrabold">{price}</span>
          <span className="text-gray-500 dark:text-gray-400 ml-1">/month</span>
        </div>
        <p className="mb-8 text-gray-500">{description}</p>
        <ul role="list" className="mb-8 space-y-4 text-left">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-3">
              <Check className="flex-shrink-0 w-5 h-5 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        {isCurrentPlan ? (
          <Button disabled className="w-full">
            Current Plan
          </Button>
        ) : (
          <Link to={user ? '/dashboard' : '/signup'} className="w-full">
            <Button className="w-full">{cta}</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default PricingCard;
