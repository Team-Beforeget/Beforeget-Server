const express = require('express');
const { 
    getAllPostController, 
    postUploadController, 
    postFilterController, 
    getOnePostController} = require('../controllers/postController');
const router = express.Router();
<<<<<<< HEAD
const { postUploadController } = require('../controllers/postController');
const uploadImage = require('../middlewares/uploadImage');

router.post('/upload', uploadImage, postUploadController);
=======

router.get('/', getAllPostController);
router.get('/filter',postFilterController);
router.post('/upload',postUploadController);
router.get('/:postId', getOnePostController);

module.exports = router;

// abcd 유저의 토큰
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
//.eyJpZCI6MiwiZW1haWwiOiJhYmNkZTEyMzRAZmdoaS5jb20iLCJuaWNrIjoi7IKs7Jqp7J6QIiwiaWRGaXJlYmFzZSI6IjRIcGdHbkYwWnhNcHd3TXFjcmpjYUZiMHp0QzMiLCJpYXQiOjE2NDE4MTM3ODksImV4cCI6MTY0MzAyMzM4OSwiaXNzIjoiY2hhbndvbyJ9
//.POkRYQeiAf8YS06IuLi65eLCMl57q_XncmCgq0vzrXI

>>>>>>> feat/post-postId

