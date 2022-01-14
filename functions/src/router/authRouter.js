const express = require('express');
const router = express.Router();
const { joinController, loginController, logoutController } = require('../controllers/authController');
const { checkUserByToken } = require('../middlewares/authMiddleware');

router.post('/join', joinController);
router.post('/login', loginController);
router.get('/logout', checkUserByToken, logoutController);

module.exports = router;