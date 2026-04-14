const express = require('express');
const router = express.Router();

// Import the controller
const plantController = require('../controllers/plantController');

// Define routes - using the Controller object directly avoids "undefined" errors
router.get('/', plantController.getPlants);
router.get('/:id', plantController.getPlant);

module.exports = router;