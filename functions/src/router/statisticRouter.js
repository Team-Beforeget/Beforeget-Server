const express = require('express');
const router = express.Router();
const { getThirdStatisticController } = require('../controllers/statisticController.js');

router.get('/third/:date',getThirdStatisticController);

router.get('/fourth/:date',getThirdStatisticController);

router.get('/total/:date',getThirdStatisticController);

module.exports = router;