const express = require('express');
const router = express.Router();
const { joinController, loginController } = require('../controllers/authController');

router.post('/join', joinController);
router.post('/login', loginController);

module.exports = router;