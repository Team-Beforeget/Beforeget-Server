const express = require('express');
const router = express.Router();
const { checkUserByToken } = require('../middlewares/authMiddleware');

router.use('/auth', require('./authRouter'));
router.use(checkUserByToken);
router.use('/home', require('./homeRouter'));
router.use('/category', require('./categoryRouter'));
router.use('/post', require('./postRouter'));
router.use('/statistic', require('./statisticRouter'));
<<<<<<< HEAD

=======
>>>>>>> 16c7fb85dcde2b064f03157dfcdfa2db2a03bcb7
module.exports = router;