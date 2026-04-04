const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Note title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    content: {
      type: String,
      required: [true, 'Note content is required'],
      maxlength: [5000, 'Content cannot exceed 5000 characters'],
    },
    plantId: {
      type: Number, // Links to plant's numeric plantId
      default: null,
    },
    plantName: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast per-user queries
noteSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Note', noteSchema);
