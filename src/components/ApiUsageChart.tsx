
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
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
  
  // Use React Query to fetch usage data
  const { data, isLoading, error } = useQuery({
    queryKey: ['apiUsage', adminView],
    queryFn: async () => {
      if (!token || initialData) return initialData;
      
      const endpoint = adminView 
        ? 'http://localhost:5000/api/admin/api-usage?days=7' 
        : 'http://localhost:5000/api/keys/usage';
        
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data.map((item: any) => ({
        name: item.date || item._id,
        value: item.count
      }));
    },
    // Use initialData as fallback if provided
    initialData: initialData,
    // Only run query if we don't have initialData and a token
    enabled: !initialData && !!token,
  });
  
  const chartData = data || [];
  
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
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-gray-500">Loading data...</p>
            </div>
          ) : error ? (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-red-500">Error loading usage data</p>
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={chartData}
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
