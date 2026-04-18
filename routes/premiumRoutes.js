const express = require('express');
const { getLeaderboardData } = require('../controllers/premiumController');
const router = express.Router();

router.get('/getLeaderboard',getLeaderboardData);

module.exports = router;