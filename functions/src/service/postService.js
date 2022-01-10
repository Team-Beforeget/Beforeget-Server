const functions = require('firebase-functions');
const db = require('../database/db');
const { postDB } = require('../database');
/**
 *  @포스트 전체 조회
 *  @route GET /post
 *  @access public
 */

const getAllPostService = async (req) => {
    const { date } = req.body;
    console.log(req.user);
    let client;
    try {
        client = await db.connect();

        const userId = req.user.id;
        const allPost = await postDB.getAllPostByUserId(client, userId);
        // 등록된 포스트 없음
        if (allPost === null) {
            return -2;
        }

        allPost.posts = allPost;
        return allPost;
    } catch (error) {
        functions.logger.error(
            `[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`,
            `[CONTENT] ${error}`
          );
          console.log(error);
          // DB 에러
          return -1;
    } finally {
        client.release();
    }
};

module.exports = { getAllPostService };