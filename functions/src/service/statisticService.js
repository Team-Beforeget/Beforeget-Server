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

    const lastDate = `${date}-${dayjs(date).daysInMonth()}`;
    const startDate = `${date}-01`;
    const month = dayjs(date).format('MM');

    let client;
    try {
        client = await db.connect();

        const userId = req.user.id;

        const media = await postDB.findPostsByDateAndCountByMedia(client, userId, startDate, lastDate);

        // TODO: 해당 달의 기록 없을 때 에러처리
        console.log((_.sortBy(media, 'count').reverse())[0].mediaId); // 가장 많이 기록한 미디어가 몇번 미디어인지~~~~
        const isManyMediaId = (_.sortBy(media, 'count').reverse())[0].mediaId; // 미디어 count 후 내림차순 정렬 
        // 다양한 경우의 수: 기록한 개수가 같을때 등등~~
        const firstPage = await statisticDB.getFirstStatisticPage(client, isManyMediaId);
        // 페이지 없음
        if (!firstPage) {
            return -3;
        }
        // 가장 많은 기록을 남긴 미디어에 대한 분기
        let comment;
        // 영화
        if (isManyMediaId === 1) {
            comment = `최신 개봉작부터 고전 영화까지 마스터!\n${month}월 영화 기록이 가장 많은 당신에게\n하루는 1440분이 아닌 1440프레임이죠!\n다음 달, 나는 어떤 유형일까요?`;
            firstPage.comment = comment;
            return firstPage;
        } 
        // 책
        else if (isManyMediaId === 2) {
            comment = `무인도에 가더라도 책 한권은 챙겨야지!\n${month}월 책 기록이 가장 많은 당신에게\n글과 감성은 빠질 수 없는 삶의 원동력이죠!\n다음 달, 나는 어떤 유형일까요?`;
            firstPage.comment = comment;
            return firstPage;
        }
        // 영화
        else if (isManyMediaId === 3) {
            console.log('========');
            comment = `방구석 1열 열정적인 리모컨트롤러!\n${month}월 TV 기록이 가장 많은 당신,\n정주행과 본방사수는 놓칠 수 없어요!\n다음 달, 나는 어떤 유형일까요?`;
            firstPage[0].comment = comment;
            return firstPage;
        }
        // 음악
        else if (isManyMediaId === 4) {
            comment = `
            하루의 시작과 끝은 음악과 함께!\n${month}월 음악 기록이 가장 많은 당신,\n오늘은 어떤 곡이 당신의 하루를 채웠나요?\n다음 달, 나의 새로운 유형을 기대해보세요!`;
            firstPage.comment = comment;
            return firstPage;
        }
        // 웹툰
        else if (isManyMediaId === 5) {
            comment = `월화수목금토일 웹툰 출근 도장 완료!\n${month}월 웹툰 기록이 가장 많은 당신에게\n가장 설레는 단어는 Update 아닌가요?\n다음 달, 나의 새로운 유형을 기대해보세요!
            `;
            firstPage.comment = comment;
            return firstPage;
        }
        // 유튜브
        else {
            comment = `유튜브를 통해 더 넒은 세상을 만나다!\n${month}월 유튜브 기록이 가장 많은 당신,\n오늘은 어떤 알고리즘이 당신을 이끌까요?\n다음 달, 나의 새로운 유형을 기대해보세요!`;
            firstPage.comment = comment;
            return firstPage;
        }

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

/**
 *  @통계 나의기록 통계 두번째 
 *  @route GET /statistic/second/:date/:count
 *  @access private
 */

const getSecondStatisticService = async (req) => {
    const { date, count } = req.params;
    console.log(date);
    // 요청 파라미터 부족
    // if (!date || !count) {
    //     return -2;
    // }
    
    let client;
    try {
        client = await db.connect();
        
        // X개의 기록을 남겼어요.
        const userId = req.user.id;
        const lastDay = dayjs(date).daysInMonth(); // 받아온 날짜의 마지막 날

        // 기본 선택 달
        const veryLastMonthRecord = await postDB.countPostsIdInDate(client, userId, date, lastDay);
        // 지지난달
        // const isDate = dayjs(date).subtract(1, 'month');
        // const theMonthBeforeLastRecord = await postDB.countPostsInDate(client, userId, isDate, lastDay);
        
        // let sumVeryLastMonthRecord, sumTheMonthBeforeLastRecord = new Number();
        
        // for (let i = 0; i < veryLastMonthRecord.length; i++) {
        //     sumVeryLastMonthRecord += Number(veryLastMonthRecord[i].count);
        //     sumTheMonthBeforeLastRecord += Number(theMonthBeforeLastRecord[i].count);
        // }
        
        // // 지난 달보다 Y개 늘었네요/줄었네요! 
        // // 지난달 기록 갯수와 지지난달 기록 갯수 비교
        // const diff = (a, b) => {
        //     let differ = a - b > 0 ? `늘었네요` : `줄었네요`
        //     let absolute = Math.abs(a-b);
        //     return `${a}개의 기록을 남겼어요.\n지난달보다 ${absolute}개 ${differ}.`;
        // }
        // const firstComment = diff(sumVeryLastMonthRecord, sumTheMonthBeforeLastRecord);

        // // A월로, n개의 기록을 남겼어요!
        // let month, newDate;
        // const lastDay = dayjs(date).daysInMonth(); // 받아온 날짜의 마지막 날
        // // Z월부터 N개월간 가장 많은 기록을 남긴 달은
        // // 3개월 선택
        // let sumOfRecord = new Number();
        // const compareArray  = new Array();
        // if (count === 3) {
        //     month = dayjs(date).subtract(2, 'month').format('MM');
        //     for (let i = 1; i <= count; i++) {
        //         newDate = dayjs(date).subtract(i, 'month');
        //         let record = await postDB.countPostsInDate(client, userId, newDate, lastDay);

        //         for (let i = 0; i < record.length; i++) {
        //             sumOfRecord += Number(record[i].count);
        //         }
        //         compareArray.push(sumOfRecord);
        //     }
        //     compareArray.sort((a, b) => b - a);
        //     return `${month}월 부터 ${count}간 가장 많은 기록을 남긴 달은`;
        // }
        // // 5개월 선택
        // else if (count === 5) {
        //     month = dayjs(date).subtract(4, 'month').format('MM');
        //     return `${month}월 부터 ${count}간 가장 많은 기록을 남긴 달은`;
        // } 
        // // 3, 5 외에는 오류
        // else {
        //     return -3;
        // }
        return veryLastMonthRecord;  
            
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


module.exports = { getFirstStatisticService, getSecondStatisticService };