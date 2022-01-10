const util = require("../lib/util");
const statusCode = require("../constants/statusCode");
const responseMessage = require("../constants/responseMessage");
const { getAllPostService } = require("../service/postService");

const getAllPostController = async (req, res) => {
    try {
        const data = await getAllPostService(req);
        // DB 에러
        if (data === -1) {
            return res
                .status(statusCode.DB_ERROR)
                .send(util.fail(
                    statusCode.DB_ERROR, 
                    responseMessage.DB_ERROR
                ));
        }
        // 등록된 포스트 없음
        else if (data === -2) {
            return res
                .status(statusCode.DB_ERROR)
                .send(util.fail(
                    statusCode.DB_ERROR, 
                    responseMessage.DB_ERROR
                ));
        }
        // 포스트 전체 조회 성공
        res
            .status(statusCode.OK)
            .send(util.success(
                statusCode.OK, 
                responseMessage.READ_ALL_POSTS_SUCCESS, 
                data
            ));
    } catch (error) {
        return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(
          statusCode.INTERNAL_SERVER_ERROR, 
          responseMessage.INTERNAL_SERVER_ERROR
        ));
    }
};

module.exports = { getAllPostController };



// const media = ["Movie","Book","TV","Music","Webtoon","Youtube"]
// const postController= async (req, res) => {
//     let client;
//     let data = {"Movie":0,"Book":0,"TV":0,"Music":0,"Webtoon":0,"Youtube":0}
//     try {
//       client = await db.connect(req);
//       const counts = await postDB.countPostsByMedia(client,req.user.id);
//       for(let i of counts){
//           data[media[i['mediaId']-1]] = i['count'];
//       }
//       res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.REQUEST_SUCCESS, data));
//     } catch (error) {
//       console.log(error);
//       res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
//     } finally {
//       client.release();
//     }
//   };