const functions = require('firebase-functions');
const db = require('../database/db');
const { postDB } = require('../database');
/**
 *  @포스트 전체 조회
 *  @route GET /post
 *  @access public
 */

const getAllPostService = async (req) => {
    let client;
    try {
        client = await db.connect();
        
        const allPost = await postDB.getAllPosts(client);
        // 등록된 포스트 없음
        if (!allPost) {
            return -2;
        }
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