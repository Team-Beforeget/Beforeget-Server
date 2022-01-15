const express = require('express');
const router = express.Router();
const { checkUserByToken } = require('../middlewares/authMiddleware');

router.use('/auth', require('./authRouter'));
router.use(checkUserByToken);
router.use('/home', require('./homeRouter'));
router.use('/category', require('./categoryRouter'));
router.use('/post', require('./postRouter'));
router.use('/statistic', require('./statisticRouter'));
module.exports = router;