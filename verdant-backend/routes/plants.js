const express = require('express');
const { getPlants, getPlant, getCategories, getBySymptom, getFeatured } = require('../controllers/plantController');

const router = express.Router();

// These must come BEFORE /:id to avoid route conflicts
router.get('/categories', getCategories);
router.get('/featured', getFeatured);
router.get('/by-symptom/:symptom', getBySymptom);

// General routes
router.get('/', getPlants);
router.get('/:id', getPlant);

module.exports = router;
