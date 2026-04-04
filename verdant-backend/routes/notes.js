const express = require('express');
const { body } = require('express-validator');
const { getNotes, createNote, updateNote, deleteNote } = require('../controllers/noteController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const noteValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 120 }).withMessage('Title max 120 chars'),
  body('content').trim().notEmpty().withMessage('Content is required').isLength({ max: 5000 }).withMessage('Content max 5000 chars'),
];

// All note routes require authentication
router.use(protect);

router.get('/', getNotes);
router.post('/', noteValidation, createNote);
router.put('/:id', noteValidation, updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
