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
        const start = date;
        // 영화
        if (isManyMediaId === 1) {
            comment = `최신 개봉작부터 고전 영화까지 마스터!\n${month}월 영화 기록이 가장 많은 당신에게\n하루는 1440분이 아닌 1440프레임이죠!\n다음 달, 나는 어떤 유형일까요?`;
            firstPage[0].start = start;
            firstPage[0].comment = comment;

            return firstPage;
        } 
        // 책
        else if (isManyMediaId === 2) {
            comment = `무인도에 가더라도 책 한권은 챙겨야지!\n${month}월 책 기록이 가장 많은 당신에게\n글과 감성은 빠질 수 없는 삶의 원동력이죠!\n다음 달, 나는 어떤 유형일까요?`;
            firstPage[0].start = start;
            firstPage[0].comment = comment;

            return firstPage;
        }
        // 영화
        else if (isManyMediaId === 3) {
            console.log('========');
            comment = `방구석 1열 열정적인 리모컨트롤러!\n${month}월 TV 기록이 가장 많은 당신,\n정주행과 본방사수는 놓칠 수 없어요!\n다음 달, 나는 어떤 유형일까요?`;
            firstPage[0].start = start;
            firstPage[0].comment = comment;

            return firstPage;
        }
        // 음악
        else if (isManyMediaId === 4) {
            comment = `하루의 시작과 끝은 음악과 함께!\n${month}월 음악 기록이 가장 많은 당신,\n오늘은 어떤 곡이 당신의 하루를 채웠나요?\n다음 달, 나의 새로운 유형을 기대해보세요!`;
            firstPage[0].start = start;
            firstPage[0].comment = comment;

            return firstPage;
        }
        // 웹툰
        else if (isManyMediaId === 5) {
            comment = `월화수목금토일 웹툰 출근 도장 완료!\n${month}월 웹툰 기록이 가장 많은 당신에게\n가장 설레는 단어는 Update 아닌가요?\n다음 달, 나의 새로운 유형을 기대해보세요!`;
            firstPage[0].start = start;
            firstPage[0].comment = comment;

            return firstPage;
        }
        // 유튜브
        else {
            comment = `유튜브를 통해 더 넒은 세상을 만나다!\n${month}월 유튜브 기록이 가장 많은 당신,\n오늘은 어떤 알고리즘이 당신을 이끌까요?\n다음 달, 나의 새로운 유형을 기대해보세요!`;
            firstPage[0].start = start;
            firstPage[0].comment = comment;

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
    console.log(date, count);
    // 요청 파라미터 부족
    if (!date || !count) {
        return -2;
    }
    
    let client;
    try {
        client = await db.connect();
        
        // X개의 기록을 남겼어요.
        const userId = req.user.id;
        
        // 기본 선택 달
        const lastDay = dayjs(date).daysInMonth(); // 받아온 날짜의 마지막 날
        const veryLastMonthRecord = await postDB.countPostsInDate(client, userId, date, lastDay);
        console.log(veryLastMonthRecord);
        // 지지난달
        const isDate = dayjs(date).subtract(1, 'month').format('YYYY-MM');
        const lastday = dayjs(date).subtract(1, 'month').daysInMonth();
        const theMonthBeforeLastRecord = await postDB.countPostsInDate(client, userId, isDate, lastday);
        console.log(theMonthBeforeLastRecord);
        
        let sumVeryLastMonthRecord = Number();
        let sumTheMonthBeforeLastRecord = Number();
        
        for (let i = 0; i < veryLastMonthRecord.length; i++) {
            sumVeryLastMonthRecord += Number(veryLastMonthRecord[i].count);
        }
        for (let i = 0; i < theMonthBeforeLastRecord.length; i++) {
            sumTheMonthBeforeLastRecord += Number(theMonthBeforeLastRecord[i].count);
        }

        // 지난 달보다 Y개 늘었네요/줄었네요! / 지난 달과 같네요
        // 지난달 기록 갯수와 지지난달 기록 갯수 비교
        const diff = (a, b) => {
            if (a !== b) {
                let differ = a - b > 0 ? `늘었네요` : `줄었네요`
                let absolute = Math.abs(a-b);
                return `${a}개의 기록을 남겼어요.\n지난달보다 ${absolute}개 ${differ}.\n`;
            } else if (a === b) {
                if (a === 0 && b === 0) {
                    return `최근에 남긴 기록이 없어요.\n`
                } else {
                    return `${a}개의 기록을 남겼어요\n지난달과 같네요.`;
                }
            } 
        }
        const firstComment = diff(sumVeryLastMonthRecord, sumTheMonthBeforeLastRecord);
        console.log(sumVeryLastMonthRecord);
        console.log(sumTheMonthBeforeLastRecord);
        // A월로, n개의 기록을 남겼어요!
        let month, newMonth, newDate, secondComment;
        // Z월부터 N개월간 가장 많은 기록을 남긴 달은
        // 3개월 선택
        // 주먹구구식 코드 => 코드 리뷰 해주세요 제발 ㅠ
        let sumOfRecord1 = Number();
        let sumOfRecord2 = Number();
        let sumOfRecord3 = Number();
        let sumOfRecord4 = Number();
        let sumOfRecord5 = Number();
        let compareObject1 = new Object();
        let compareObject2 = new Object();
        let compareObject3 = new Object();
        let compareObject4 = new Object();
        let compareObject5 = new Object();
        let numCompareArray  = new Array();
        let compareArray = new Array();
        if (parseInt(count) === 3) {
            let mon, memo;
            month = dayjs(date).subtract(2, 'month').format('MM');
            for (let i = 0; i < count; i++) {
                newDate = dayjs(date).subtract(i, 'month').format('YYYY-MM');
                newMonth = dayjs(date).subtract(i, 'month').format('MM');
                let lastday = dayjs(date).subtract(i, 'month').daysInMonth();

                let record = await postDB.countPostsInDate(client, userId, newDate, lastday);

                if (i === 0) {
                    for (let i = 0; i < record.length; i++) {
                        sumOfRecord1 += Number(record[i].count);
                    }
                    compareObject1.count = sumOfRecord1;
                    compareObject1.month = newMonth;
                    compareArray.push(compareObject1);
                    numCompareArray.push(sumOfRecord1);
                } else if (i === 1) {
                    for (let i = 0; i < record.length; i++) {
                        sumOfRecord2 += Number(record[i].count);
                    }
                    compareObject2.count = sumOfRecord2;
                    compareObject2.month = newMonth;
                    compareArray.push(compareObject2);
                    numCompareArray.push(sumOfRecord2);
                } else if (i === 2) {
                    for (let i = 0; i < record.length; i++) {
                        sumOfRecord3 += Number(record[i].count);
                    }
                    compareObject3.count = sumOfRecord3;
                    compareObject3.month = newMonth;
                    compareArray.push(compareObject3);
                    numCompareArray.push(sumOfRecord3);
                }
            }
            memo = (numCompareArray.sort((a, b) => b - a))[0];

            // compareArray.forEach(obj => {
            //     if (obj.count === memo) {
            //         mon = obj.month;
            //     }
            // });

            // let mon1, mon2, mon3;
            for (let i = 0; i < compareArray.length; i++) {
                if (compareArray[i].count === memo) {
                    mon = compareArray[i].month;
                    // } else if (compareArray[i].count === memo && compareArray[i+1].count === memo) {
                    //     if (compareArray[i].count === memo) {
                    //         mon1 = compareArray[i].month;
                    //     } 
                    //     if (compareArray[i+1].count === memo) {
                    //         mon2 = compareArray[i+1].month;
                    //     }
                    //     secondComment = `${month}월 부터 ${count}달간 가장 많은 기록을 남긴 달은\n${mon1}, ${mon2}월로, 각각 ${memo}개의 기록을 남겼어요!\n다음달 나의 그래프는 어떤 모양일까요?`;
                    // } 
                }
            }
            console.log(compareArray);

            if (numCompareArray[0] === 0 && numCompareArray[1] === 0 && numCompareArray[2] === 0) {
                secondComment = `감상한 미디어를 기록해보세요!`;
            } else {
                secondComment = `${month}월 부터 ${count}달간 가장 많은 기록을 남긴 달은\n${mon}월로, ${memo}개의 기록을 남겼어요!\n다음달 나의 그래프 모양은 어떤 모양일까요?`;
            }
            
            const comment = `${firstComment}${secondComment}`;
            const start = date;
            const recordCount = compareArray;
    
            return { start, recordCount, comment };  
        }
        // 5개월 선택
        else if (parseInt(count) === 5) {
            let mon, memo;
            month = dayjs(date).subtract(4, 'month').format('MM');

            for (let i = 0; i < count; i++) {
                newDate = dayjs(date).subtract(i, 'month').format('YYYY-MM');
                newMonth = dayjs(date).subtract(i, 'month').format('MM');
                let lastday = dayjs(date).subtract(i, 'month').daysInMonth();
                
                let record = await postDB.countPostsInDate(client, userId, newDate, lastday);
                //console.log(record);
                if (i === 0) {
                    for (let i = 0; i < record.length; i++) {
                        sumOfRecord1 += Number(record[i].count);
                    }
                    compareObject1.count = sumOfRecord1;
                    compareObject1.month = newMonth;
                    compareArray.push(compareObject1);
                    numCompareArray.push(sumOfRecord1);
                    
                } else if (i === 1) {
                    for (let i = 0; i < record.length; i++) {
                        sumOfRecord2 += Number(record[i].count);
                    }
                    compareObject2.count = sumOfRecord2;
                    compareObject2.month = newMonth;
                    compareArray.push(compareObject2);
                    numCompareArray.push(sumOfRecord2);
                } else if (i === 2) {
                    for (let i = 0; i < record.length; i++) {
                        sumOfRecord3 += Number(record[i].count);
                    }
                    compareObject3.count = sumOfRecord3;
                    compareObject3.month = newMonth;
                    compareArray.push(compareObject3);
                    numCompareArray.push(sumOfRecord3);
                } else if (i === 3) {
                    for (let i = 0; i < record.length; i++) {
                        sumOfRecord4 += Number(record[i].count);
                    }
                    compareObject4.count = sumOfRecord4;
                    compareObject4.month = newMonth;
                    compareArray.push(compareObject4);
                    numCompareArray.push(sumOfRecord4);
                } else if (i === 4) {
                    for (let i = 0; i < record.length; i++) {
                        sumOfRecord5 += Number(record[i].count);
                    }
                    compareObject5.count = sumOfRecord5;
                    compareObject5.month = newMonth;
                    compareArray.push(compareObject5);
                    numCompareArray.push(sumOfRecord5);
                }

            }
            memo = (numCompareArray.sort((a, b) => b - a))[0];
            

            compareArray.forEach(obj => {
                if (obj.count === memo) {
                    mon = obj.month;
                } 
            });

            if (numCompareArray[0] === 0 && numCompareArray[1] === 0 && numCompareArray[2] === 0 && numCompareArray[3] === 0 && numCompareArray[4] === 0) {
                secondComment = `감상한 미디어를 기록해보세요!`;
            } else {
                secondComment = `${month}월 부터 ${count}달간 가장 많은 기록을 남긴 달은\n${mon}월로, ${memo}개의 기록을 남겼어요!\n다음달 나의 그래프 모양은 어떤 모양일까요?`;
            }

            console.log(numCompareArray);
            const comment = `${firstComment}${secondComment}`;
            
            const start = date;
            const recordCount = compareArray;

            return { start, recordCount, comment };  
        } 
        // 3, 5 외에는 오류
        else {
            return -3;
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


module.exports = { getFirstStatisticService, getSecondStatisticService };