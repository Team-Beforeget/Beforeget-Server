const util = require("../lib/util");
const statusCode = require("../constants/statusCode");
const responseMessage = require("../constants/responseMessage");
const { 
  getAllPostService, 
  postUploadService, 
  getFilterService, 
  getOnePostService,
  postUpdateService,
  postDeleteService } = require("../service/postService");

/**
 *  @포스트 전체 조회
 *  @route GET /post
 *  @access private
 */

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
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(
          statusCode.BAD_REQUEST, 
          responseMessage.NO_POST
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

/**
 *  @포스트 포스트 업로드 (글쓰기)
 *  @route POST /post/upload
 *  @access private
 */

 const postUploadController= async (req, res) => {

  const data = await postUploadService(req);

  if (data == -2){
    res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.POST_REQUIRED_UNFULFILLED));
  }else if(data == -5){
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  }else{
    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.ADD_ONE_POST_SUCCESS, data));
  }

};

const postUpdateController= async (req, res) => {

  const data = await postUpdateService(req);

  if (data == -2){
    res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_POST));
  }
  else if(data == -3){
    res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
  }else if(data == -5){
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  }else{
    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.UPDATE_ONE_POST_SUCCESS, {}));
  }

};

const postDeleteController = async (req,res)=>{
  const data = await postDeleteService(req);

  if (data == -2){
    res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_POST));
  }else if(data == -3){
    res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
  }else if(data == -5){
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  }else{
    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.DELETE_ONE_POST_SUCCESS, {}));
  }
}

/**
 *  @포스트 나의기록 필터링
 *  @route GET /post/filter?
 *  @access private
 */

const postFilterController = async (req, res) => {
  try {
    const data = await getFilterService(req);
    // DB에러
    if (data === -1) {
      return res
        .status(statusCode.DB_ERROR)
        .send(util.fail(
          statusCode.DB_ERROR, 
          responseMessage.DB_ERROR
        ));
    }
    // 필터 결과 해당 포스트 없음
    else if (data === -2) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(
          statusCode.BAD_REQUEST, 
          responseMessage.NO_POST
        ));
    } 
    // 포스트 조회 성공
    res
      .status(statusCode.OK)
      .send(util.success(
        statusCode.OK, 
        responseMessage.READ_ONE_POST_SUCCESS, 
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

/**
 *  @포스트 나의기록 상세보기
 *  @route GET /post/:postId
 *  @access private
 */

const getOnePostController = async (req, res) => {
  try {
    const myData = await getOnePostService(req);
    // DB 에러
    if (myData === -1) {
      return res
        .status(statusCode.DB_ERROR)
        .send(util.fail(
          statusCode.DB_ERROR, 
          responseMessage.DB_ERROR
        ));
    }
    // 요청 파라미터 없음
    else if (myData === -2) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(
          statusCode.BAD_REQUEST, 
          responseMessage.NULL_VALUE
        ));
    }
    // 포스트 없음
    else if (myData === -3) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(
          statusCode.BAD_REQUEST, 
          responseMessage.NO_POST
        ));
    }
    // 나의 기록 상세보기 성공
    else {
      res
        .status(statusCode.OK)
        .send(util.success(
          statusCode.OK, 
          responseMessage.READ_ONE_POST_SUCCESS, 
          myData
        ));
    } 
    
  } catch (error) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(util.fail(
        statusCode.INTERNAL_SERVER_ERROR, 
        responseMessage.INTERNAL_SERVER_ERROR
      ));
  }
};


module.exports = { 
  getAllPostController, 
  postUploadController, 
  postFilterController,
  getOnePostController,
  postUpdateController,
  postDeleteController
};
