const db = require('../database/db');
const { postDB } = require('../database');

const media = ["Movie","Book","TV","Music","Webtoon","Youtube"]
const getHomeService = async (req, res) => {
    let client;
    let data = {"Movie":0,"Book":0,"TV":0,"Music":0,"Webtoon":0,"Youtube":0}
    try {
      client = await db.connect(req);
      const counts = await postDB.countPostsByMedia(client,req.user.id);
      for(i of counts){
          data[media[i['mediaId']-1]] = i['count'];
      }
      return data;

    } catch (error) {
        return -5;

    } finally {
      client.release();
    }
  };


module.exports = {
    getHomeService
}