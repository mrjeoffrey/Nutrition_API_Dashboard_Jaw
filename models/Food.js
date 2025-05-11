import mongoose from 'mongoose';

const FoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  calories: {
    type: Number,
    required: true
  },
  serving_size_g: {
    type: Number,
    required: true
  },
  fat_g: {
    type: Number,
    required: true
  },
  carbs_g: {
    type: Number,
    required: true
  },
  protein_g: {
    type: Number,
    required: true
  },
  fiber_g: {
    type: Number,
    default: 0
  },
  sugar_g: {
    type: Number,
    default: 0
  },
  sodium_mg: {
    type: Number,
    default: 0
  },
  barcode: {
    type: String,
    sparse: true,
    index: true
  },
  source: {
    type: String,
    default: 'USDA'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create text index for search functionality
FoodSchema.index({ name: 'text' });

export default mongoose.model('Food', FoodSchema);
