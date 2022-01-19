const db = require('../database/db');
const { mediaDB } = require('../database');
const slackAPI = require('../middlewares/slackAPI');

const getOnelinesService = async (req, res) => {
    const { id } = req.params;
    if(!id){
        return -2;
    }else if( id > 6 || id < 1){
        return -3;
    }
    let client;
    try{
        client = await db.connect();
        const good = await mediaDB.getGoodOnelinesByMediaId(client, id);
        const bad = await mediaDB.getBadOnelinesByMediaId(client, id);

        const onelines = {};
        onelines['good'] = good['good'];
        onelines['bad'] = bad['bad'];
        console.log(onelines)
        return onelines;

    } catch (error) {
        const slackMessage = `[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl} ${error}`;
   
        slackAPI.sendMessageToSlack(slackMessage, slackAPI.DEV_WEB_HOOK_ERROR_MONITORING);
        return -5;
    } finally {
        client.release();
    }
}

const getRecommendsService = async (req, res) => {
    const { id } = req.params;
    if(!id){
        return -2;
    }else if( id > 6 || id < 1){
        return -3;
    }
    let client;
    try {
        client = await db.connect();
        const recommends = await mediaDB.getRecommendsByMediaId(client, id);
        return recommends;

    } catch (error) {
        const slackMessage = `[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl} ${error}`;
   
        slackAPI.sendMessageToSlack(slackMessage, slackAPI.DEV_WEB_HOOK_ERROR_MONITORING);
      return -5;
    } finally {
      client.release();
    }
  };

module.exports = {
    getOnelinesService,
    getRecommendsService
}