const Plant = require('../models/Plant');

// @desc    Get all plants (with optional filters)
// @route   GET /api/plants
// @access  Public
const getPlants = async (req, res, next) => {
  try {
    const { category, search, featured, tag, symptom } = req.query;
    const filter = {};

    if (category && category !== 'All') filter.cat = category;
    if (featured === 'true') filter.featured = true;
    if (tag) filter.tags = { $in: [tag] };
    if (symptom) filter.symptoms = { $regex: symptom, $options: 'i' };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sci: { $regex: search, $options: 'i' } },
        { desc: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { symptoms: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const plants = await Plant.find(filter).sort({ rating: -1, name: 1 });
    res.status(200).json({ success: true, count: plants.length, plants });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single plant by plantId (numeric)
// @route   GET /api/plants/:id
// @access  Public
const getPlant = async (req, res, next) => {
  try {
    const plant = await Plant.findOne({ plantId: Number(req.params.id) });
    if (!plant) {
      return res.status(404).json({ success: false, message: 'Plant not found.' });
    }
    res.status(200).json({ success: true, plant });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique categories
// @route   GET /api/plants/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Plant.distinct('cat');
    res.status(200).json({ success: true, categories: ['All', ...categories.sort()] });
  } catch (error) {
    next(error);
  }
};

// @desc    Get plants by symptom
// @route   GET /api/plants/by-symptom/:symptom
// @access  Public
const getBySymptom = async (req, res, next) => {
  try {
    const plants = await Plant.find({
      symptoms: { $regex: req.params.symptom, $options: 'i' },
    }).sort({ rating: -1 });

    res.status(200).json({ success: true, count: plants.length, plants });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured plants
// @route   GET /api/plants/featured
// @access  Public
const getFeatured = async (req, res, next) => {
  try {
    const plants = await Plant.find({ featured: true }).sort({ rating: -1 });
    res.status(200).json({ success: true, count: plants.length, plants });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPlants, getPlant, getCategories, getBySymptom, getFeatured };
