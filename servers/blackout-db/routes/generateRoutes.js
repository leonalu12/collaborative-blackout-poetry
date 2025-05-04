const express = require('express');
const { generateText } = require('../controllers/generateController');

const router = express.Router();
router.post('/', generateText);
module.exports = router;