const express = require('express');
const { getFirstStatisticController, getSecondStatisticController } = require('../controllers/statisticController');
const { getSecondStatisticService } = require('../service/statisticService');
const router = express.Router();

router.get('/first/:date', getFirstStatisticController);
router.get('/second/:date/:count', getSecondStatisticController);

module.exports = router;