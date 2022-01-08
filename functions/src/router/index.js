const express = require('express');
const router = express.Router();
const auth = require('./auth');

router.use('/auth', require('./authRouter'));

module.exports = router;