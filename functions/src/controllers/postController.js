const util = require("../lib/util");
const statusCode = require("../constants/statusCode");
const responseMessage = require("../constants/responseMessage");
const { postUploadService, postUpdateService, postDeleteService } = require('../service/postService');

const postUploadController= async (req, res) => {

  const data = await postUploadService(req);

  if (data == -2){
    res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.POST_REQUIRED_UNFULFILLED));
  }else if(data == -5){
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  }else{
    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.ADD_ONE_POST_SUCCESS, {}));
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

module.exports = { postUploadController, postUpdateController, postDeleteController };