import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Food from './models/Food.js';
import User from './models/User.js';

// Load environment variables
dotenv.config();

// Sample food data
const foodData = [
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
    name: 'Orange',
    calories: 47,
    serving_size_g: 100,
    fat_g: 0.1,
    carbs_g: 12,
    protein_g: 0.9,
    fiber_g: 2.4,
    sugar_g: 9.4,
    sodium_mg: 0
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
    name: 'Salmon',
    calories: 208,
    serving_size_g: 100,
    fat_g: 13,
    carbs_g: 0,
    protein_g: 20,
    fiber_g: 0,
    sugar_g: 0,
    sodium_mg: 59
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
  },
  {
    name: 'Broccoli',
    calories: 34,
    serving_size_g: 100,
    fat_g: 0.4,
    carbs_g: 7,
    protein_g: 2.8,
    fiber_g: 2.6,
    sugar_g: 1.7,
    sodium_mg: 33
  },
  {
    name: 'Greek Yogurt',
    calories: 59,
    serving_size_g: 100,
    fat_g: 0.4,
    carbs_g: 3.6,
    protein_g: 10,
    fiber_g: 0,
    sugar_g: 3.6,
    sodium_mg: 36
  },
  {
    name: 'Avocado',
    calories: 160,
    serving_size_g: 100,
    fat_g: 14.7,
    carbs_g: 8.5,
    protein_g: 2,
    fiber_g: 6.7,
    sugar_g: 0.7,
    sodium_mg: 7
  },
  {
    name: 'Coca-Cola',
    calories: 42,
    serving_size_g: 100,
    fat_g: 0,
    carbs_g: 10.6,
    protein_g: 0,
    fiber_g: 0,
    sugar_g: 10.6,
    sodium_mg: 4,
    barcode: '049000042566'
  }
];

// Create admin user
const adminUser = {
  name: 'Admin User',
  email: 'admin@nutriverse.com',
  password: 'admin123',
  role: 'admin'
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nutriverse')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Clear existing food data
      await Food.deleteMany({});
      console.log('Cleared existing food data');
      
      // Insert new food data
      const foods = await Food.insertMany(foodData);
      console.log(`Inserted ${foods.length} food items`);
      
      // Check if admin exists
      const existingAdmin = await User.findOne({ email: adminUser.email });
      
      if (!existingAdmin) {
        // Create admin user
        await User.create(adminUser);
        console.log('Admin user created');
      } else {
        console.log('Admin user already exists');
      }
      
      console.log('Database seeded successfully');
    } catch (error) {
      console.error('Error seeding database:', error);
    } finally {
      // Close connection
      mongoose.connection.close();
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
