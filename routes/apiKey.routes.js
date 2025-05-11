
import express from 'express';
import ApiKey from '../models/ApiKey.js';
import ApiLog from '../models/ApiLog.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all API keys for current user
router.get('/', protect, async (req, res) => {
  try {
    const apiKeys = await ApiKey.find({ user: req.user._id });
    res.json(apiKeys);
  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Generate new API key
router.post('/', protect, async (req, res) => {
  try {
    // Add a default value if req.body is undefined
    const name = req.body?.name || 'API Key';
    
    const apiKey = new ApiKey({
      user: req.user._id,
      name: name
    });
    
    await apiKey.save();
    res.status(201).json(apiKey);
  } catch (error) {
    console.error('Generate API key error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Deactivate API key
router.put('/:id/deactivate', protect, async (req, res) => {
  try {
    const apiKey = await ApiKey.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!apiKey) {
      return res.status(404).json({ error: 'API key not found' });
    }
    
    apiKey.active = false;
    await apiKey.save();
    
    res.json(apiKey);
  } catch (error) {
    console.error('Deactivate API key error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get API usage statistics
router.get('/usage', protect, async (req, res) => {
  try {
    // Get all API keys for current user
    const apiKeys = await ApiKey.find({ user: req.user._id }).select('key');
    const keysList = apiKeys.map(k => k.key);
    
    // Get the date range (last 7 days by default)
    const days = parseInt(req.query.days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Aggregate API usage by day
    const logs = await ApiLog.aggregate([
      {
        $match: {
          apiKey: { $in: keysList },
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

// Get recent API logs
router.get('/logs', protect, async (req, res) => {
  try {
    // Get all API keys for current user
    const apiKeys = await ApiKey.find({ user: req.user._id }).select('key');
    const keysList = apiKeys.map(k => k.key);
    
    // Limit number of results
    const limit = parseInt(req.query.limit) || 20;
    
    // Get recent logs
    const logs = await ApiLog.find({ apiKey: { $in: keysList } })
      .sort({ timestamp: -1 })
      .limit(limit);
    
    res.json(logs);
  } catch (error) {
    console.error('Get API logs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
