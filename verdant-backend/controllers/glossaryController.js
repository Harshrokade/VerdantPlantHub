const Glossary = require('../models/Glossary');

// @desc    Get all glossary terms
// @route   GET /api/glossary
// @access  Public
const getGlossary = async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { term: { $regex: search, $options: 'i' } },
        { def: { $regex: search, $options: 'i' } },
      ];
    }

    const terms = await Glossary.find(filter).sort({ term: 1 });
    res.status(200).json({ success: true, count: terms.length, glossary: terms });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single glossary term
// @route   GET /api/glossary/:term
// @access  Public
const getTerm = async (req, res, next) => {
  try {
    const term = await Glossary.findOne({
      term: { $regex: `^${req.params.term}$`, $options: 'i' },
    });

    if (!term) {
      return res.status(404).json({ success: false, message: 'Term not found.' });
    }

    res.status(200).json({ success: true, term });
  } catch (error) {
    next(error);
  }
};

module.exports = { getGlossary, getTerm };
