const express = require('express');
const router = express.Router();
const { 
    getFirstStatisticController, 
    getThirdStatisticController, 
    getFourthStatisticController,
    getTotalStatisticController } = require('../controllers/statisticController');

router.get('/first/:date', getFirstStatisticController);

router.get('/third/:date',getThirdStatisticController);
router.get('/fourth/:date',getFourthStatisticController);
router.get('/total/:date',getTotalStatisticController);


module.exports = router;