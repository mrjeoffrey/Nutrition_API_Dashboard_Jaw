
import axios from 'axios';
import { toast } from 'sonner';

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

export const initializeDatabase = async () => {
  try {
    // Check if the database has any foods
    const response = await axios.get('/v1_1/search/count');
    
    // If there are no foods, add the default ones
    if (response.data.count === 0) {
      console.log('Food database is empty, adding default foods...');
      
      // Add each food to the database
      for (const food of defaultFoods) {
        await axios.post('/admin/foods', food);
      }
      
      console.log('Default foods added to database');
      toast.success('Default food items have been added to the database.');
    }
  } catch (error) {
    console.error('Error initializing food database:', error);
  }
};
