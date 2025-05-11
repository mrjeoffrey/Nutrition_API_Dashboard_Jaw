
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const ApiKeyCard = () => {
  const { apiKey, setApiKey, token } = useAuth();
  const [isRevealed, setIsRevealed] = useState(false);
  const queryClient = useQueryClient();
  
  // Create API key mutation
  const apiKeyMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        'http://localhost:5000/api/keys', 
        { name: 'Default API Key' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: (data) => {
      setApiKey(data.key);
      queryClient.invalidateQueries({ queryKey: ['apiKey'] });
      toast.success('API key generated successfully');
    },
    onError: (error) => {
      console.error('Failed to generate API key:', error);
      toast.error('Failed to generate API key');
    }
  });

  const handleCopyClick = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    toast.success('API key copied to clipboard');
  };

  const handleGenerateClick = () => {
    apiKeyMutation.mutate();
  };

  const toggleReveal = () => {
    setIsRevealed(!isRevealed);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Key</CardTitle>
        <CardDescription>Use this key to authenticate your API requests</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {apiKey ? (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Input 
                type={isRevealed ? "text" : "password"} 
                value={apiKey} 
                readOnly 
                className="font-mono"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleReveal}
              >
                {isRevealed ? 'Hide' : 'Show'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopyClick}
              >
                Copy
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              This key grants access to your account's API quota. Keep it secure and never share it publicly.
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-4">You don't have an API key yet</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerateClick}
          className="w-full"
          variant={apiKey ? "outline" : "default"}
          disabled={apiKeyMutation.isPending}
        >
          {apiKeyMutation.isPending 
            ? "Generating..." 
            : apiKey 
              ? "Regenerate API Key" 
              : "Generate API Key"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiKeyCard;
