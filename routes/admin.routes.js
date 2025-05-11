import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import { Readable } from 'stream';
import User from '../models/User.js';
import Food from '../models/Food.js';
import ApiLog from '../models/ApiLog.js';
import PromoCode from '../models/PromoCode.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Apply admin middleware to all routes
router.use(protect, admin);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user (toggle status)
router.put('/users/:id/toggle-status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Toggle role between user and admin
    user.role = user.role === 'user' ? 'admin' : 'user';
    await user.save();
    
    res.json(user);
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get food items (with pagination)
router.get('/foods', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const foods = await Food.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const totalFoods = await Food.countDocuments();
    
    res.json({
      foods,
      page,
      totalPages: Math.ceil(totalFoods / limit),
      totalItems: totalFoods
    });
  } catch (error) {
    console.error('Get foods error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new food item
router.post('/foods', async (req, res) => {
  try {
    const { name, calories, serving_size_g, fat_g, carbs_g, protein_g, fiber_g, sugar_g, sodium_mg, barcode } = req.body;
    
    const food = new Food({
      name,
      calories,
      serving_size_g,
      fat_g,
      carbs_g,
      protein_g,
      fiber_g: fiber_g || 0,
      sugar_g: sugar_g || 0,
      sodium_mg: sodium_mg || 0,
      barcode
    });
    
    await food.save();
    res.status(201).json(food);
  } catch (error) {
    console.error('Add food error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete food item
router.delete('/foods/:id', async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    
    if (!food) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    
    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    console.error('Delete food error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload CSV file for bulk food import
router.post('/foods/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a CSV file' });
    }
    
    const results = [];
    const errors = [];
    let processed = 0;
    
    // Create readable stream from buffer
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);
    
    bufferStream
      .pipe(csv())
      .on('data', (data) => {
        // Process each row
        processed++;
        
        // Check for required fields
        if (!data.name || !data.calories) {
          errors.push(`Row ${processed}: Missing required fields`);
          return;
        }
        
        // Convert string values to numbers
        const foodItem = {
          name: data.name,
          calories: parseFloat(data.calories) || 0,
          serving_size_g: parseFloat(data.serving_size_g) || 100,
          fat_g: parseFloat(data.fat_g) || 0,
          carbs_g: parseFloat(data.carbs_g) || 0,
          protein_g: parseFloat(data.protein_g) || 0
        };
        
        // Add optional fields if they exist
        if (data.fiber_g) foodItem.fiber_g = parseFloat(data.fiber_g) || 0;
        if (data.sugar_g) foodItem.sugar_g = parseFloat(data.sugar_g) || 0;
        if (data.sodium_mg) foodItem.sodium_mg = parseFloat(data.sodium_mg) || 0;
        if (data.barcode) foodItem.barcode = data.barcode;
        
        results.push(foodItem);
      })
      .on('end', async () => {
        if (results.length === 0) {
          return res.status(400).json({ 
            error: 'No valid food items found in the CSV file',
            processed,
            errors
          });
        }
        
        // Insert food items in batches
        try {
          await Food.insertMany(results, { ordered: false });
          res.json({
            message: `Successfully imported ${results.length} food items`,
            imported: results.length,
            processed,
            errors
          });
        } catch (err) {
          console.error('Error inserting food items:', err);
          res.status(500).json({ 
            error: 'Error inserting food items',
            imported: err.insertedDocs ? err.insertedDocs.length : 0,
            processed,
            errors: [...errors, err.message]
          });
        }
      });
  } catch (error) {
    console.error('CSV upload error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get API usage statistics
router.get('/api-usage', async (req, res) => {
  try {
    // Get the date range (last 30 days by default)
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Aggregate API usage by day
    const logs = await ApiLog.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Format the response
    const usageData = logs.map(item => ({
      date: item._id,
      count: item.count
    }));
    
    res.json(usageData);
  } catch (error) {
    console.error('Get API usage error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get promo codes
router.get('/promocodes', async (req, res) => {
  try {
    const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
    res.json(promoCodes);
  } catch (error) {
    console.error('Get promo codes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create promo code
router.post('/promocodes', async (req, res) => {
  try {
    const { code, discount, expiresAt, maxUses } = req.body;
    
    // Check if promo code already exists
    const existing = await PromoCode.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ error: 'Promo code already exists' });
    }
    
    const promoCode = new PromoCode({
      code: code.toUpperCase(),
      discount,
      expiresAt: new Date(expiresAt),
      maxUses: maxUses || null
    });
    
    await promoCode.save();
    res.status(201).json(promoCode);
  } catch (error) {
    console.error('Create promo code error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export const adminRoutes = router;
