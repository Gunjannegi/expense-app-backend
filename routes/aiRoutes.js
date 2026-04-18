const express = require('express');
const { askPrompt } = require('../controllers/aiController');
const authenticate = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticate, askPrompt);

module.exports = router;