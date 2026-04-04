const User = require('../models/User');
const Plant = require('../models/Plant');

// @desc    Get user's favorite plants (full plant objects)
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const plants = await Plant.find({ plantId: { $in: user.favorites } });
    res.status(200).json({ success: true, count: plants.length, favorites: user.favorites, plants });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle a plant in/out of favorites
// @route   POST /api/favorites/toggle
// @access  Private
const toggleFavorite = async (req, res, next) => {
  try {
    const { plantId } = req.body;
    if (!plantId) {
      return res.status(400).json({ success: false, message: 'plantId is required.' });
    }

    const user = await User.findById(req.user._id);
    const isFav = user.favorites.includes(Number(plantId));

    if (isFav) {
      user.favorites = user.favorites.filter((id) => id !== Number(plantId));
    } else {
      user.favorites.push(Number(plantId));
    }

    await user.save();

    res.status(200).json({
      success: true,
      added: !isFav,
      favorites: user.favorites,
      message: isFav ? 'Removed from favorites.' : 'Added to favorites.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sync all favorites at once (bulk replace)
// @route   PUT /api/favorites/sync
// @access  Private
const syncFavorites = async (req, res, next) => {
  try {
    const { favorites } = req.body;
    if (!Array.isArray(favorites)) {
      return res.status(400).json({ success: false, message: 'favorites must be an array.' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { favorites: favorites.map(Number) },
      { new: true }
    );

    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFavorites, toggleFavorite, syncFavorites };
