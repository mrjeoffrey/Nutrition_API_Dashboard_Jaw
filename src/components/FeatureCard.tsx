
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
}

const FeatureCard = ({ title, description, icon, className }: FeatureCardProps) => {
  return (
    <div className={cn(
      "bg-white p-6 rounded-lg shadow-md border border-gray-100 transition-all hover:shadow-lg",
      className
    )}>
      <div className="w-12 h-12 mb-4 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
