const express = require('express');
const router = express.Router();
const { postUploadController, postDeleteController } = require('../controllers/postController');
const uploadImage = require('../middlewares/uploadImage');

router.post('/upload', uploadImage, postUploadController);
router.delete('/:postId/delete', postDeleteController);

module.exports = router;