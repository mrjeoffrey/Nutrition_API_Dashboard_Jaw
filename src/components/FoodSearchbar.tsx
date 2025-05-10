
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

interface Food {
  id: string;
  name: string;
  calories: number;
  serving_size_g: number;
  fat_g: number;
  carbs_g: number;
  protein_g: number;
}

interface FoodSearchbarProps {
  onFoodSelect?: (food: Food) => void;
}

const FoodSearchbar = ({ onFoodSelect }: FoodSearchbarProps) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Food[]>([]);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const { apiKey } = useAuth();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter a search term');
      return;
    }
    
    if (!apiKey) {
      toast.error('You need an API key to search for food items');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.get(`/v1_1/search/${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });
      
      const foods = response.data.foods || [];
      
      setResults(foods);
      setIsResultsVisible(true);
      
      if (foods.length === 0) {
        toast.info('No food items found. Try a different search term.');
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error(error.response?.data?.error || 'Failed to search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFoodSelect = (food: Food) => {
    if (onFoodSelect) {
      onFoodSelect(food);
    }
    setIsResultsVisible(false);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="flex w-full">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a food (e.g., apple)"
          className="rounded-r-none"
        />
        <Button 
          type="submit" 
          disabled={isLoading || !apiKey}
          className="rounded-l-none"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </form>
      
      {isResultsVisible && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {results.map((food) => (
              <li
                key={food.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleFoodSelect(food)}
              >
                <div className="font-medium">{food.name}</div>
                <div className="text-sm text-gray-500">
                  {food.calories} kcal | {food.serving_size_g}g serving
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FoodSearchbar;
