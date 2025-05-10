
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter a search term');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulated API call - in a real app, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockResults: Food[] = [
        {
          id: '1',
          name: 'Apple',
          calories: 52,
          serving_size_g: 100,
          fat_g: 0.2,
          carbs_g: 14,
          protein_g: 0.3
        },
        {
          id: '2',
          name: 'Apple, Fuji',
          calories: 63,
          serving_size_g: 100,
          fat_g: 0.2,
          carbs_g: 15.3,
          protein_g: 0.3
        },
        {
          id: '3',
          name: 'Apple Juice',
          calories: 46,
          serving_size_g: 100,
          fat_g: 0.1,
          carbs_g: 11.3,
          protein_g: 0.1
        }
      ].filter(food => 
        food.name.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(mockResults);
      setIsResultsVisible(true);
      
      if (mockResults.length === 0) {
        toast.info('No food items found. Try a different search term.');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search. Please try again.');
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
          disabled={isLoading}
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
