const express = require('express');
const router = express.Router();
const { 
    getFirstStatisticController, 
    getSecondStatisticController,
    getThirdStatisticController, 
    getFourthStatisticController,
    getTotalStatisticController } = require('../controllers/statisticController');

router.get('/first/:date', getFirstStatisticController);
router.get('/second/:date/:count', getSecondStatisticController);
router.get('/third/:date',getThirdStatisticController);
router.get('/fourth/:date',getFourthStatisticController);
router.get('/total/:date',getTotalStatisticController);


module.exports = router;