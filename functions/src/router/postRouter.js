const express = require('express');
const router = express.Router();
const { postUploadController } = require('../controllers/postController');
const uploadImage = require('../middlewares/uploadImage');

router.post('/upload', uploadImage, postUploadController);

module.exports = router;