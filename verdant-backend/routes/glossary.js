const express = require('express');
const { getGlossary, getTerm } = require('../controllers/glossaryController');

const router = express.Router();

router.get('/', getGlossary);
router.get('/:term', getTerm);

module.exports = router;
