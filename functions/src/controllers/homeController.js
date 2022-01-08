const util = require("../lib/util");
const statusCode = require("../constants/statusCode");
const responseMessage = require("../constants/responseMessage");
const db = require('../database/db');
const { postDB } = require('../database');

const media = ["Movie","Book","TV","Music","Webtoon","Youtube"]
const getHomeController= async (req, res) => {
    let client;
    let data = {"Movie":0,"Book":0,"TV":0,"Music":0,"Webtoon":0,"Youtube":0}
    try {
      client = await db.connect(req);
      const counts = await postDB.countPostsByMedia(client,req.user.id);
      for(i of counts){
          data[media[i['mediaId']-1]] = i['count'];
      }
      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.REQUEST_SUCCESS, data));
    } catch (error) {
      console.log(error);
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    } finally {
      client.release();
    }
  };

module.exports = { getHomeController };