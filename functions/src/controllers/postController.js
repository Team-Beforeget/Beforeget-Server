const util = require("../lib/util");
const statusCode = require("../constants/statusCode");
const responseMessage = require("../constants/responseMessage");
const { postUploadService } = require('../service/postService');

const postUploadController= async (req, res) => {

  const data = await postUploadService(req);

  if (data == -2){
    res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.POST_REQUIRED_UNFULFILLED));
  }else if(data == -3){
    res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.POST_ADDITIONAL_UNFULFILLED));
  }else if(data == -5){
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  }else{
    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.ADD_ONE_POST_SUCCESS, {}));
  }

};

module.exports = { postUploadController };