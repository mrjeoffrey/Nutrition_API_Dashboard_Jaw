import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import FoodDetailModal from './FoodDetailModal';

interface Food {
  _id?: string;
  id?: string;
  name: string;
  calories: number;
  serving_size_g: number;
  fat_g: number;
  carbs_g: number;
  protein_g: number;
  fiber_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
}

interface FoodSearchbarProps {
  onFoodSelect?: (food: Food) => void;
}

const FoodSearchbar = ({ onFoodSelect }: FoodSearchbarProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Food[]>([]);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { apiKey } = useAuth();

  // Search mutation with React Query
  const searchMutation = useMutation({
    mutationFn: async (searchTerm: string) => {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/v1_1/search/${encodeURIComponent(searchTerm)}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });
      return response.data.foods || [];
    },
    onSuccess: (data) => {
      setResults(data);
      setIsResultsVisible(true);
      
      if (data.length === 0) {
        toast.info('No food items found. Try a different search term.');
      }
    },
    onError: (error: any) => {
      console.error('Search error:', error);
      toast.error(error.response?.data?.error || 'Failed to search. Please try again.');
    }
  });

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
    
    searchMutation.mutate(query);
  };

  const handleFoodSelect = (food: Food) => {
    setSelectedFood(food);
    setIsModalOpen(true);
    setIsResultsVisible(false);
    
    if (onFoodSelect) {
      onFoodSelect(food);
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="flex w-full">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a food (e.g., apple)"
          className="rounded-r-none text-gray-700"
        />
        <Button 
          type="submit" 
          disabled={searchMutation.isPending || !apiKey}
          className="rounded-l-none"
        >
          {searchMutation.isPending ? 'Searching...' : 'Search'}
        </Button>
      </form>
      
      {isResultsVisible && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {results.map((food) => (
              <li
                key={food.id || food._id}
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

      <FoodDetailModal 
        food={selectedFood} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default FoodSearchbar;
