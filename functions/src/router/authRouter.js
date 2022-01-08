const express = require('express');
const router = express.Router();
const { joinController, getController } = require('../controllers/authController');

router.post('/join', joinController);
router.get('/',getController);

module.exports = router;