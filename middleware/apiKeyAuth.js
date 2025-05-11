
import ApiKey from '../models/ApiKey.js';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import ApiLog from '../models/ApiLog.js';

export default async (req, res, next) => {
  // Check for API key in headers or query params
  let apiKey = null;
  
  if (req.headers.authorization) {
    // Extract from Authorization header
    apiKey = req.headers.authorization.replace('Bearer ', '');
  } else if (req.query.apiKey) {
    // Extract from query parameter
    apiKey = req.query.apiKey;
  }
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key is required' });
  }
  
  try {
    const keyData = await ApiKey.findOne({ key: apiKey, active: true }).populate('user');
    
    if (!keyData) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    // Check subscription status and limits
    const subscription = await Subscription.findOne({ user: keyData.user._id, status: 'active' });
    
    if (!subscription && keyData.usageCount >= 100) {
      return res.status(403).json({ error: 'API usage limit reached. Please upgrade your plan.' });
    }
    
    if (subscription && subscription.usageLimit <= keyData.usageCount) {
      return res.status(403).json({ error: 'API usage limit reached for your plan.' });
    }
    
    // Log this API request
    const startTime = Date.now();
    
    // Add user data to request
    req.apiKey = keyData;
    req.user = keyData.user;
    
    // Update usage count and last used timestamp
    await ApiKey.findByIdAndUpdate(keyData._id, {
      $inc: { usageCount: 1 },
      lastUsed: new Date()
    });
    
    // Call next middleware
    res.on('finish', () => {
      // This will execute after the response is sent
      const responseTime = Date.now() - startTime;
      
      ApiLog.create({
        apiKey: apiKey,
        user: keyData.user._id,
        endpoint: req.originalUrl,
        method: req.method,
        status: res.statusCode,
        ip: req.ip,
        responseTime
      }).catch(err => console.error('Error logging API request:', err));
    });
    
    next();
  } catch (error) {
    console.error('API Key Auth Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
