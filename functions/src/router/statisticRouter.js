const express = require('express');
const { getFirstStatisticController } = require('../controllers/statisticController');
const router = express.Router();

router.get('/first/:date', getFirstStatisticController);

module.exports = router;