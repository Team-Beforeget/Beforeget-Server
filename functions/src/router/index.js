const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRouter'));
router.use('/category', require('./categoryRouter'));

module.exports = router;