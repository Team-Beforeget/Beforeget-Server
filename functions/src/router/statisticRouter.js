const express = require('express');
const router = express.Router();
const { getThirdStatisticController, getFourthStatisticController } = require('../controllers/statisticController.js');

router.get('/third/:date',getThirdStatisticController);

router.get('/fourth/:date',getFourthStatisticController);

router.get('/total/:date',getFourthStatisticController);

module.exports = router;