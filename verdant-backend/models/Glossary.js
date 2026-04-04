const mongoose = require('mongoose');

const glossarySchema = new mongoose.Schema(
  {
    term: {
      type: String,
      required: [true, 'Term is required'],
      trim: true,
      unique: true,
    },
    def: {
      type: String,
      required: [true, 'Definition is required'],
    },
    category: {
      type: String,
      default: 'General',
    },
  },
  {
    timestamps: true,
  }
);

glossarySchema.index({ term: 'text', def: 'text' });

module.exports = mongoose.model('Glossary', glossarySchema);
