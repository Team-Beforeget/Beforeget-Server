const util = require("../lib/util");
const statusCode = require("../constants/statusCode");
const responseMessage = require("../constants/responseMessage");
const { getOnelinesService, getRecommendsService } = require('../services/categoryServices');

const onelineController = async (req, res) => {

    const data = await getOnelinesService(req);
    
    if (data === -1) {
      return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.DB_ERROR));
  }else if (data == -2) {
      return res
      .status(statusCode.BAD_REQUEST)
      .send(
      util.fail(
          statusCode.BAD_REQUEST,
          responseMessage.NULL_VALUE
        )
      );
  }else if (data == -3) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(
      util.fail(
          statusCode.BAD_REQUEST,
          responseMessage.OUT_OF_VALUE
        )
      );
  }else if (data == -5){
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          responseMessage.INTERNAL_SERVER_ERROR
        )
      );
  }
  else {
    res
    .status(statusCode.OK)
    .send(
        util.success(
            statusCode.OK, 
            responseMessage.REQUEST_SUCCESS, 
            data)
    );
  }
}

const recommendController= async (req, res) => {

  const data = await getRecommendsService(req);

  if (data === -1) {
    return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.DB_ERROR));
  }else if (data == -2) {
      return res
      .status(statusCode.BAD_REQUEST)
      .send(
      util.fail(
          statusCode.BAD_REQUEST,
          responseMessage.NULL_VALUE
        )
      );
  }else if (data == -3) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(
      util.fail(
          statusCode.BAD_REQUEST,
          responseMessage.OUT_OF_VALUE
        )
      );
  }else if (data == -5){
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          responseMessage.INTERNAL_SERVER_ERROR
        )
      );
  }
  else {
    res
    .status(statusCode.OK)
    .send(
        util.success(
            statusCode.OK, 
            responseMessage.REQUEST_SUCCESS, 
            data)
    );
  }
  };

module.exports = { onelineController, recommendController };