const express = require('express');
const router = express.Router();
const { getThirdStatisticController, getFourthStatisticController,
getTotalStatisticController } = require('../controllers/statisticController.js');

router.get('/third/:date',getThirdStatisticController);

router.get('/fourth/:date',getFourthStatisticController);

router.get('/total/:date',getTotalStatisticController);

module.exports = router;