const express = require('express');
const router = express.Router();
const { postUploadController } = require('../controllers/postController');

router.post('/upload',postUploadController);

module.exports = router;