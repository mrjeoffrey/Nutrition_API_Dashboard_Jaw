
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

interface ApiUsageChartProps {
  data?: {
    name: string;
    value: number;
  }[];
  adminView?: boolean;
}

const ApiUsageChart = ({ data: initialData, adminView = false }: ApiUsageChartProps) => {
  const { token } = useAuth();
  const [data, setData] = useState<{ name: string; value: number }[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  
  useEffect(() => {
    if (initialData) {
      setData(initialData);
      return;
    }
    
    const fetchUsageData = async () => {
      if (!token) return;
      
      setLoading(true);
      try {
        const endpoint = adminView 
          ? '/api/admin/api-usage?days=7' 
          : '/api/keys/usage';
          
        const response = await axios.get(endpoint);
        
        const usageData = response.data.map((item: any) => ({
          name: item.date || item._id,
          value: item.count
        }));
        
        setData(usageData);
      } catch (error) {
        console.error('Failed to fetch API usage data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsageData();
  }, [token, initialData, adminView]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Usage</CardTitle>
        <CardDescription>
          Your {adminView ? 'platform' : 'daily'} API request usage over the past week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-gray-500">Loading data...</p>
            </div>
          ) : data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-gray-500">No API usage data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiUsageChart;
