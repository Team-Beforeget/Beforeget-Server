const express = require('express');
const router = express.Router();
const { getHomeController } = require('../controllers/homeController');

router.get('/',getHomeController);

module.exports = router;