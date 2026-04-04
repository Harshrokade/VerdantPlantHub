const express = require('express');
const { getFavorites, toggleFavorite, syncFavorites } = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All favorites routes require authentication
router.use(protect);

router.get('/', getFavorites);
router.post('/toggle', toggleFavorite);
router.put('/sync', syncFavorites);

module.exports = router;
