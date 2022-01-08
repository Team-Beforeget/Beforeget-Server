const util = require("../lib/util");
const statusCode = require("../constants/statusCode");
const responseMessage = require("../constants/responseMessage");
const db = require('../database/db');
const { mediaDB } = require('../database');

const onelineController = async (req, res) => {
    const { id } = req.params;
    if(!id){
        return res
            .status(statusCode.BAD_REQUEST)
            .send(
            util.fail(
                statusCode.BAD_REQUEST,
                responseMessage.NULL_VALUE
          )
        );
    }else if( id > 6 || id < 1){
        return res
        .status(statusCode.BAD_REQUEST)
        .send(
        util.fail(
            statusCode.BAD_REQUEST,
            responseMessage.OUT_OF_VALUE
      )
    );
    }
    let client;
    try{
        client = await db.connect();
        const onelines = await mediaDB.getOnelinesByMediaId(client, id);
        res
        .status(statusCode.OK)
        .send(
            util.success(
                statusCode.OK, 
                responseMessage.REQUEST_SUCCESS, 
                onelines)
        );
    } catch (error) {
        return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.INTERNAL_SERVER_ERROR
          )
        );
    } finally {
        client.release();
    }
}

const recommendController= async (req, res) => {
    const { id } = req.params;
    if(!id){
        return res
            .status(statusCode.BAD_REQUEST)
            .send(
            util.fail(
                statusCode.BAD_REQUEST,
                responseMessage.NULL_VALUE
          )
        );
    }else if( id > 6 || id < 1){
        return res
        .status(statusCode.BAD_REQUEST)
        .send(
        util.fail(
            statusCode.BAD_REQUEST,
            responseMessage.OUT_OF_VALUE
      )
    );
    }
    let client;
    try {
        client = await db.connect();
        const recommends = await mediaDB.getRecommendsByMediaId(client, id);
        res
        .status(statusCode.OK)
        .send(
            util.success(
                statusCode.OK, 
                responseMessage.REQUEST_SUCCESS, 
                recommends)
        );
    } catch (error) {
      console.log(error);
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    } finally {
      client.release();
    }
  };

module.exports = { onelineController, recommendController };