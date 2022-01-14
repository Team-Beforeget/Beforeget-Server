const express = require('express');
const router = express.Router();
const { postUploadController, postUpdateController, postDeleteController } = require('../controllers/postController');
const uploadImage = require('../middlewares/uploadImage');

router.post('/upload', uploadImage, postUploadController);
router.put('/:postId/edit', uploadImage, postUpdateController);
router.delete('/:postId/delete', postDeleteController);

module.exports = router;