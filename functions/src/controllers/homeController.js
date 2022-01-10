const util = require("../lib/util");
const statusCode = require("../constants/statusCode");
const responseMessage = require("../constants/responseMessage");
const { getHomeService } = require('../service/homeService');

const getHomeController= async (req, res) => {

    const data = await getHomeService(req);

    if (data == -5){
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }else{
      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.REQUEST_SUCCESS, data));
    }

  };

module.exports = { getHomeController };