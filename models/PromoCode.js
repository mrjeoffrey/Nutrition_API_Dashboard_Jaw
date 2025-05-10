
const mongoose = require('mongoose');

const PromoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  discount: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  expiresAt: {
    type: Date,
    required: true
  },
  timesUsed: {
    type: Number,
    default: 0
  },
  maxUses: {
    type: Number,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PromoCode', PromoCodeSchema);
