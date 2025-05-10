
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

type User = {
  id: string;
  name: string;
  email: string;
  picture: string;
  role: 'user' | 'admin';
};

type SubscriptionTier = 'free' | 'basic' | 'pro';

type SubscriptionDetails = {
  tier: SubscriptionTier;
  expiresAt: string;
  usageLimit: number;
  usageCount: number;
};

interface AuthContextType {
  user: User | null;
  subscription: SubscriptionDetails | null;
  loading: boolean;
  login: (response: any) => void;
  logout: () => void;
  apiKey: string | null;
  generateApiKey: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Simulate loading user from localStorage
        const savedUser = localStorage.getItem('user');
        const savedApiKey = localStorage.getItem('apiKey');
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
          
          // Simulate fetching subscription data
          setSubscription({
            tier: 'free',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            usageLimit: 100,
            usageCount: 0
          });
          
          if (savedApiKey) {
            setApiKey(savedApiKey);
          }
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (response: any) => {
    try {
      // In a real implementation, we would validate the Google OAuth response
      // and make a backend call to register/login the user
      
      const userData: User = {
        id: response.sub || 'demo-user-id',
        name: response.name || 'Demo User',
        email: response.email || 'demo@example.com',
        picture: response.picture || 'https://ui-avatars.com/api/?name=Demo+User',
        role: 'user'
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Simulate fetching subscription data after login
      setSubscription({
        tier: 'free',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        usageLimit: 100,
        usageCount: 0
      });

      // Check if user already has API key
      const savedApiKey = localStorage.getItem('apiKey');
      if (savedApiKey) {
        setApiKey(savedApiKey);
      }
      
      toast.success('Logged in successfully');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    setSubscription(null);
    setApiKey(null);
    localStorage.removeItem('user');
    localStorage.removeItem('apiKey');
    toast.info('Logged out successfully');
  };

  const generateApiKey = async () => {
    try {
      // In a real app, this would make an API call to generate the key
      const newApiKey = 'nutr_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setApiKey(newApiKey);
      localStorage.setItem('apiKey', newApiKey);
      toast.success('API Key generated successfully');
      return newApiKey;
    } catch (error) {
      console.error('Failed to generate API key:', error);
      toast.error('Failed to generate API key');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, subscription, loading, login, logout, apiKey, generateApiKey }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
