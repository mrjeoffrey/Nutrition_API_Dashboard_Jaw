
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ApiKeyCard from '@/components/ApiKeyCard';
import SubscriptionCard from '@/components/SubscriptionCard';
import ApiUsageChart from '@/components/ApiUsageChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [apiUsageData, setApiUsageData] = useState<{ name: string; value: number }[]>([]);
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
    
    // Generate mock API usage data
    const generateMockData = () => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return days.map(day => ({
        name: day,
        value: Math.floor(Math.random() * 80) + 10
      }));
    };
    
    setApiUsageData(generateMockData());
  }, [user, loading, navigate]);
  
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Developer Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your API keys, monitor usage, and access documentation.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <ApiKeyCard />
              <div className="mt-6">
                <SubscriptionCard />
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <ApiUsageChart data={apiUsageData} />
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Start</CardTitle>
                      <CardDescription>Get started with the NutriVerse API in seconds</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <h3 className="font-medium">1. Authentication</h3>
                          <p className="text-sm text-gray-500">Use your API key in the Authorization header</p>
                          <div className="bg-gray-50 p-2 rounded-md font-mono text-sm overflow-x-auto">
                            Authorization: Bearer {'{your-api-key}'}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <h3 className="font-medium">2. Search for a food</h3>
                          <p className="text-sm text-gray-500">Make a request to the search endpoint</p>
                          <div className="bg-gray-50 p-2 rounded-md font-mono text-sm overflow-x-auto">
                            GET https://api.nutriverse.com/v1_1/search/apple
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <h3 className="font-medium">3. Get detailed nutrition info</h3>
                          <p className="text-sm text-gray-500">Use the item endpoint with the food ID</p>
                          <div className="bg-gray-50 p-2 rounded-md font-mono text-sm overflow-x-auto">
                            GET https://api.nutriverse.com/v1_1/item?id=123456
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="endpoints" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>API Endpoints</CardTitle>
                      <CardDescription>Available endpoints in the NutriVerse API</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">Search Endpoint</h3>
                          <div className="flex items-center">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">GET</span>
                            <span className="ml-2 font-mono text-sm">/v1_1/search/:query</span>
                          </div>
                          <p className="text-sm text-gray-500">
                            Search for food items by name. Returns a list of matching food items with basic nutrition information.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">Item Endpoint</h3>
                          <div className="flex items-center">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">GET</span>
                            <span className="ml-2 font-mono text-sm">/v1_1/item?id=:item_id</span>
                          </div>
                          <p className="text-sm text-gray-500">
                            Get detailed nutrition information for a specific food item by its ID.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">Barcode Endpoint</h3>
                          <div className="flex items-center">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">GET</span>
                            <span className="ml-2 font-mono text-sm">/v1_1/barcode?code=:barcode</span>
                          </div>
                          <p className="text-sm text-gray-500">
                            Look up a food item by its barcode. Returns the food item with detailed nutrition information if found.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="logs" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>API Request Logs</CardTitle>
                      <CardDescription>Recent API calls made from your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Timestamp</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Endpoint</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Response Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="py-3 px-4 text-sm">2025-05-10 14:32:15</td>
                              <td className="py-3 px-4 text-sm font-mono">/v1_1/search/banana</td>
                              <td className="py-3 px-4"><span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">200 OK</span></td>
                              <td className="py-3 px-4 text-sm">124ms</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-3 px-4 text-sm">2025-05-10 14:31:42</td>
                              <td className="py-3 px-4 text-sm font-mono">/v1_1/item?id=12345</td>
                              <td className="py-3 px-4"><span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">200 OK</span></td>
                              <td className="py-3 px-4 text-sm">98ms</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-3 px-4 text-sm">2025-05-10 14:30:55</td>
                              <td className="py-3 px-4 text-sm font-mono">/v1_1/search/apple</td>
                              <td className="py-3 px-4"><span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">200 OK</span></td>
                              <td className="py-3 px-4 text-sm">112ms</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 text-sm">2025-05-10 14:28:19</td>
                              <td className="py-3 px-4 text-sm font-mono">/v1_1/barcode?code=12345</td>
                              <td className="py-3 px-4"><span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">404 Not Found</span></td>
                              <td className="py-3 px-4 text-sm">87ms</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
