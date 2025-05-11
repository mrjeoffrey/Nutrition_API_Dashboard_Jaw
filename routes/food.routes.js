import express from 'express';
import Food from '../models/Food.js';
import apiKeyAuth from '../middleware/apiKeyAuth.js';

const router = express.Router();

// Apply API key authentication middleware to all routes
router.use(apiKeyAuth);

// Search food by name
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters long' });
    }
    
    const foods = await Food.find({
      $text: { $search: query }
    }, {
      score: { $meta: "textScore" }
    })
    .sort({ score: { $meta: "textScore" } })
    .limit(20);
    
    if (foods.length === 0) {
      // If no exact matches found, try partial match
      const regexFoods = await Food.find({
        name: { $regex: query, $options: 'i' }
      })
      .limit(20);
      
      return res.json({
        foods: regexFoods
      });
    }
    
    res.json({
      foods
    });
  } catch (error) {
    console.error('Food search error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get food by ID
router.get('/item', async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Food ID is required' });
    }
    
    const food = await Food.findById(id);
    
    if (!food) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    
    res.json(food);
  } catch (error) {
    console.error('Get food by ID error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get food by barcode
router.get('/barcode', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: 'Barcode is required' });
    }
    
    const food = await Food.findOne({ barcode: code });
    
    if (!food) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    
    res.json(food);
  } catch (error) {
    console.error('Get food by barcode error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;