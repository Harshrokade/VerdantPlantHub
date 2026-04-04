const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema(
  {
    plantId: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Plant name is required'],
      trim: true,
    },
    sci: {
      type: String,
      required: true,
      trim: true,
    },
    emoji: {
      type: String,
      default: '🌿',
    },
    cat: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    desc: {
      type: String,
      required: true,
    },
    origin: String,
    part: String,
    flavor: String,
    preparation: String,
    dosage: String,
    caution: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    symptoms: {
      type: [String],
      default: [],
    },
    color: {
      type: String,
      default: '#d6f5d8',
    },
  },
  {
    timestamps: true,
  }
);

// Text index for full-text search
plantSchema.index({ name: 'text', sci: 'text', desc: 'text', tags: 'text', symptoms: 'text' });

module.exports = mongoose.model('Plant', plantSchema);
