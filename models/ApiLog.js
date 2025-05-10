
const mongoose = require('mongoose');

const ApiLogSchema = new mongoose.Schema({
  apiKey: {
    type: String,
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  endpoint: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  responseTime: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('ApiLog', ApiLogSchema);
