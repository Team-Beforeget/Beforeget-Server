const express = require('express');
const router = express.Router();
const { joinController } = require('../controllers/authController');

router.post('/join', joinController);

module.exports = router;