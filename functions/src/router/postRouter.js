const express = require('express');
const router = express.Router();
const uploadImage = require('../middlewares/uploadImage');
const { 
    getAllPostController, 
    postUploadController, 
    postFilterController, 
    getOnePostController,
    postUpdateController, postDeleteController } = require('../controllers/postController');


router.get('/', getAllPostController);
router.get('/filter',postFilterController);
router.post('/upload', uploadImage, postUploadController);
router.get('/:postId', getOnePostController);
router.put('/:postId/edit', uploadImage, postUpdateController);
router.delete('/:postId/delete', postDeleteController);

module.exports = router;

// abcd 유저의 토큰
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
//.eyJpZCI6MiwiZW1haWwiOiJhYmNkZTEyMzRAZmdoaS5jb20iLCJuaWNrIjoi7IKs7Jqp7J6QIiwiaWRGaXJlYmFzZSI6IjRIcGdHbkYwWnhNcHd3TXFjcmpjYUZiMHp0QzMiLCJpYXQiOjE2NDE4MTM3ODksImV4cCI6MTY0MzAyMzM4OSwiaXNzIjoiY2hhbndvbyJ9
//.POkRYQeiAf8YS06IuLi65eLCMl57q_XncmCgq0vzrXI



