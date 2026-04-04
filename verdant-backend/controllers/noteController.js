const { validationResult } = require('express-validator');
const Note = require('../models/Note');

// @desc    Get all notes for logged-in user
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notes.length, notes });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, content, plantId, plantName } = req.body;

    const note = await Note.create({
      user: req.user._id,
      title,
      content,
      plantId: plantId || null,
      plantName: plantName || '',
    });

    res.status(201).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found.' });
    }

    const { title, content, plantId, plantName } = req.body;
    note.title = title || note.title;
    note.content = content || note.content;
    note.plantId = plantId !== undefined ? plantId : note.plantId;
    note.plantName = plantName !== undefined ? plantName : note.plantName;

    await note.save();
    res.status(200).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found.' });
    }
    res.status(200).json({ success: true, message: 'Note deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };
