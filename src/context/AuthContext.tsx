import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

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
  token: string | null;
}

// Define base API URL - use the correct path
const API_URL = 'http://localhost:5000/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Load token from localStorage
        const savedToken = localStorage.getItem('token');
        
        if (savedToken) {
          setToken(savedToken);
          
          // Set axios auth header
          axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
          
          // Fetch user data - corrected path
          const res = await axios.get(`${API_URL}/auth/me`);
          setUser({
            id: res.data._id,
            name: res.data.name,
            email: res.data.email,
            picture: res.data.picture || '',
            role: res.data.role
          });
          
          // Fetch API key if available - corrected path
          await fetchApiKey();
          
          // Fetch subscription data - corrected path
          await fetchSubscription();
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        localStorage.removeItem('token');
        axios.defaults.headers.common['Authorization'] = '';
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);
  
  const fetchApiKey = async () => {
    try {
      const res = await axios.get(`${API_URL}/keys`);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        // Use the first active API key
        const activeKey = res.data.find((key) => key.active);
        if (activeKey) {
          setApiKey(activeKey.key);
        }
      }
    } catch (error) {
      console.error('Failed to fetch API key:', error);
    }
  };
  
  const fetchSubscription = async () => {
    try {
      const res = await axios.get(`${API_URL}/subscriptions/current`);
      if (res.data && res.data.subscription) {
        setSubscription({
          tier: res.data.plan,
          expiresAt: res.data.subscription.expiresAt,
          usageLimit: res.data.subscription.usageLimit,
          usageCount: 0 // We'll fetch this separately
        });
      } else {
        setSubscription({
          tier: 'free',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          usageLimit: 100,
          usageCount: 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch subscription data:', error);
    }
  };

  const login = async (response: any) => {
    try {
      let result;
      
      if (response.credential) {
        // Google OAuth login - corrected path
        const googleUser = JSON.parse(atob(response.credential.split('.')[1]));
        result = await axios.post(`${API_URL}/auth/google`, {
          name: googleUser.name,
          email: googleUser.email,
          googleId: googleUser.sub,
          picture: googleUser.picture
        });
      } else {
        // Regular login - corrected path
        result = await axios.post(`${API_URL}/auth/login`, {
          email: response.email,
          password: response.password
        });
      }
      
      const { token, user } = result.data;
      
      // Save token and set user
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setToken(token);
      setUser(user);
      
      // Fetch API key if available
      await fetchApiKey();
      
      // Fetch subscription data
      await fetchSubscription();
      
      toast.success('Logged in successfully');
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    setSubscription(null);
    setApiKey(null);
    setToken(null);
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = '';
    toast.info('Logged out successfully');
  };

  const generateApiKey = async () => {
    try {
      // Add name property to request body
      const res = await axios.post(`${API_URL}/keys`, { name: 'Default API Key' });
      const newApiKey = res.data.key;
      setApiKey(newApiKey);
      toast.success('API Key generated successfully');
      return newApiKey;
    } catch (error: any) {
      console.error('Failed to generate API key:', error);
      toast.error(error.response?.data?.error || 'Failed to generate API key');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      subscription, 
      loading, 
      login, 
      logout, 
      apiKey, 
      generateApiKey,
      token
    }}>
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
