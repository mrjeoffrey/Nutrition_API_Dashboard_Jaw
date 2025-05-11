import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';

const Admin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/');
      toast.error('You do not have access to this page');
    }
  }, [user, loading, navigate]);
  
  // Mock data
  const [users, setUsers] = useState([
    { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active', apiKey: 'nutr_123abc', plan: 'pro' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'active', apiKey: 'nutr_456def', plan: 'basic' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', status: 'blocked', apiKey: 'nutr_789ghi', plan: 'free' },
  ]);
  
  const [foods, setFoods] = useState([
    { id: '1', name: 'Apple', calories: 95, fat: 0.3, carbs: 25, protein: 0.5 },
    { id: '2', name: 'Banana', calories: 105, fat: 0.4, carbs: 27, protein: 1.3 },
    { id: '3', name: 'Chicken Breast', calories: 165, fat: 3.6, carbs: 0, protein: 31 },
  ]);
  
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  
  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? {...user, status: user.status === 'active' ? 'blocked' : 'active'} 
        : user
    ));
    toast.success('User status updated');
  };
  
  const handleDeleteFood = (foodId: string) => {
    setFoods(foods.filter(food => food.id !== foodId));
    toast.success('Food item deleted');
  };
  
  const handleCreatePromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Promo code ${promoCode} created with ${discount}% discount`);
    setPromoCode('');
    setDiscount('');
    setExpiryDate('');
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, we would process the CSV file here
      toast.success('File uploaded, processing data');
    }
  };
  
  const handleAddDefaultFoods = async () => {
    try {
      const defaultFoods = [
        {
          name: 'Apple',
          calories: 52,
          serving_size_g: 100,
          fat_g: 0.2,
          carbs_g: 14,
          protein_g: 0.3,
          fiber_g: 2.4,
          sugar_g: 10.3,
          sodium_mg: 1
        },
        {
          name: 'Banana',
          calories: 89,
          serving_size_g: 100,
          fat_g: 0.3,
          carbs_g: 23,
          protein_g: 1.1,
          fiber_g: 2.6,
          sugar_g: 12.2,
          sodium_mg: 1
        },
        {
          name: 'Chicken Breast',
          calories: 165,
          serving_size_g: 100,
          fat_g: 3.6,
          carbs_g: 0,
          protein_g: 31,
          fiber_g: 0,
          sugar_g: 0,
          sodium_mg: 74
        },
        {
          name: 'Brown Rice',
          calories: 112,
          serving_size_g: 100,
          fat_g: 0.9,
          carbs_g: 23.5,
          protein_g: 2.6,
          fiber_g: 1.8,
          sugar_g: 0.4,
          sodium_mg: 5
        }
      ];
      
      // Add each food to the database
      for (const food of defaultFoods) {
        await axios.post('/admin/foods', food);
      }
      
      // Refresh the food list
      setFoods([...foods, ...defaultFoods.map((food, index) => ({ 
        id: `new-${index}`, 
        ...food 
      }))]);
      
      toast.success('Default food items have been added to the database.');
    } catch (error) {
      console.error('Error adding default foods:', error);
      toast.error('Failed to add default food items.');
    }
  };
  
  if (loading || !user || user.role !== 'admin') {
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
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage users, food database, and platform settings.</p>
            </div>
          </div>
          
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="food-db">Food Database</TabsTrigger>
              <TabsTrigger value="import">Data Import</TabsTrigger>
              <TabsTrigger value="promo">Promo Codes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>View and manage user accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Plan</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user.id} className="border-b">
                            <td className="py-3 px-4">{user.name}</td>
                            <td className="py-3 px-4">{user.email}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="capitalize">{user.plan}</span>
                            </td>
                            <td className="py-3 px-4">
                              <Button 
                                variant={user.status === 'active' ? 'destructive' : 'outline'} 
                                size="sm"
                                onClick={() => handleToggleUserStatus(user.id)}
                              >
                                {user.status === 'active' ? 'Block' : 'Activate'}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="food-db" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Food Database</CardTitle>
                  <CardDescription>Manage food items and nutrition data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex justify-end gap-2">
                    <Button onClick={handleAddDefaultFoods}>Add Default Foods</Button>
                    <Button>Add Food Item</Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Calories</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Fat (g)</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Carbs (g)</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Protein (g)</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {foods.map(food => (
                          <tr key={food.id} className="border-b">
                            <td className="py-3 px-4">{food.name}</td>
                            <td className="py-3 px-4">{food.calories}</td>
                            <td className="py-3 px-4">{food.fat}</td>
                            <td className="py-3 px-4">{food.carbs}</td>
                            <td className="py-3 px-4">{food.protein}</td>
                            <td className="py-3 px-4 space-x-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteFood(food.id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="import" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Import</CardTitle>
                  <CardDescription>Import food data from CSV files</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="file-upload">Upload CSV File</Label>
                      <div className="flex items-center gap-4">
                        <Input 
                          id="file-upload" 
                          type="file" 
                          accept=".csv" 
                          onChange={handleFileUpload}
                        />
                        <Button>Upload</Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Upload USDA Food Data Central CSV files to import nutrition data.
                      </p>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h3 className="font-semibold mb-2">Import Instructions</h3>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                        <li>Download the latest CSV from <a href="https://fdc.nal.usda.gov/download-datasets.html" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">USDA FDC</a></li>
                        <li>Ensure the CSV follows the required format</li>
                        <li>Upload the file using the form above</li>
                        <li>The system will process the data and update the food database</li>
                      </ol>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h3 className="font-semibold mb-2">Recent Imports</h3>
                      <div className="text-sm">
                        <div className="flex justify-between py-2 border-b">
                          <span>USDA_Foundation_Foods.csv</span>
                          <span className="text-gray-500">2025-05-01</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span>Branded_Foods_Update.csv</span>
                          <span className="text-gray-500">2025-04-15</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="promo" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Promo Codes</CardTitle>
                  <CardDescription>Create and manage promotional discounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-4">Create New Promo Code</h3>
                      <form onSubmit={handleCreatePromoCode} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="promo-code">Promo Code</Label>
                          <Input
                            id="promo-code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="e.g., SUMMER2025"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="discount">Discount (%)</Label>
                          <Input
                            id="discount"
                            type="number"
                            min="1"
                            max="100"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            placeholder="e.g., 20"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            required
                          />
                        </div>
                        
                        <Button type="submit">Create Promo Code</Button>
                      </form>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-4">Active Promo Codes</h3>
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Code</th>
                              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Discount</th>
                              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Expires</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="py-3 px-4">WELCOME25</td>
                              <td className="py-3 px-4">25%</td>
                              <td className="py-3 px-4">2025-06-30</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4">SPRING2025</td>
                              <td className="py-3 px-4">15%</td>
                              <td className="py-3 px-4">2025-05-31</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;
