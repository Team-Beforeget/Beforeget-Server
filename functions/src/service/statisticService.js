const functions = require('firebase-functions');
const db = require('../database/db');
const _ = require('lodash');
const dayjs = require('dayjs');
const { statisticDB, postDB } = require('../database');

/**
 *  @통계 나의기록 통계
 *  @route GET /statistic/first/:date
 *  @access private
 */

const getFirstStatisticService = async (req) => {
    const { date } = req.params;
    // 요청 파라미터 없음
    if (!date) {
        return -2;
    }
    console.log(date);
    console.log(typeof(date)); // string
    const newDate = dayjs(date).format('YYYY-MM-01');

    
    let client;
    try {
        client = await db.connect();

        const userId = req.user.id;

        const media = await postDB.findPostsByDateAndCountByMedia(client, userId, newDate);

        // console.log(media);
        // console.log(media[0].count);
        // const mediaCount = _.sortBy(media, 'count').reverse(); // 내림차순 정렬
        // console.log(mediaCount);
        // console.log(mediaCount[0].count);
        console.log((_.sortBy(media, 'count').reverse())[0].mediaId); // 가장 많이 기록한 미디어가 몇번 미디어인지~~~~
        const isManyMediaId = (_.sortBy(media, 'count').reverse())[0].mediaId;
        // 다양한 경우의 수 like 사용자가 기록 안했을때, 기록한 개수가 같을때 등등~~

        const firstPage = await statisticDB.getFirstStatisticPage(client, isManyMediaId);
        // 찾는 페이지 없음
        if (!firstPage) {
            return -3;
        }
        return firstPage;

    } catch (error) {
        functions.logger.error(
            `[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`,
            `[CONTENT] ${error}`
          );
          console.log(error);
          // DB 에러
          return -1;
    } finally {
        client.release();
    }
};

module.exports = { getFirstStatisticService };