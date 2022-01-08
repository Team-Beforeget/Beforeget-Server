const express = require('express');
const router = express.Router();
const { onelineController, recommendController } = require('../controllers/categoryController');

router.get('/:id', onelineController);
router.get('/:id/additional', recommendController);

module.exports = router;