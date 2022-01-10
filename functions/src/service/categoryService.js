const db = require('../database/db');
const { mediaDB } = require('../database');

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
        const onelines = await mediaDB.getOnelinesByMediaId(client, id);
        return onelines;

    } catch (error) {
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
      return -5;
    } finally {
      client.release();
    }
  };

module.exports = {
    getOnelinesService,
    getRecommendsService
}