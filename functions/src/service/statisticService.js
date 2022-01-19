const functions = require('firebase-functions');
const db = require('../database/db');
const _ = require('lodash');
const dayjs = require('dayjs');
const { statisticDB, postDB } = require('../database');
const slackAPI = require('../middlewares/slackAPI');

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
    let month = dayjs(date).format('MM');
    if(month.charAt(0)=='0'){ month = month.substr(1,1); }
    let client;
    try {
        client = await db.connect();

        const userId = req.user.id;
        
        const media = await postDB.findPostsByDateAndCountByMedia(client, userId, startDate, lastDate);
        if (media.length === 0) {
          return -3;
        }
        // TODO 앱잼 이후: post 중에 가장 먼저 기록된 녀석의 날짜 가져오기 
        // 미디어 count 후 내림차순 정렬 
        const isManyMediaId = (_.sortBy(media, 'count').reverse())[0].mediaId; 
        // 다양한 경우의 수: 기록한 개수가 같을때 등등~~
        const firstPage = await statisticDB.getFirstStatisticPage(client, isManyMediaId);
        // 페이지 없음
        if (!firstPage) {
            return -3;
        }
        // 가장 많은 기록을 남긴 미디어에 대한 분기
        let comment;
        let start = await postDB.getCreatedAtByUserId(client, req.user.id);
        start = dayjs(start.date).format('YYYY-MM')
        // 영화
        if (isManyMediaId === 1) {
            comment = `최신 개봉작부터 고전 영화까지 마스터!\n${month}월 영화 기록이 가장 많은 당신에게\n하루는 1440분이 아닌 1440프레임이죠!\n다음 달, 나는 어떤 유형일까요?`;
            firstPage[0].start = start;
            firstPage[0].comment = comment;

            return firstPage[0];
        } 
        // 책
        else if (isManyMediaId === 2) {
            comment = `무인도에 가더라도 책 한권은 챙겨야지!\n${month}월 책 기록이 가장 많은 당신에게\n글과 감성은 빠질 수 없는 삶의 원동력이죠!\n다음 달, 나는 어떤 유형일까요?`;
            firstPage[0].start = start;
            firstPage[0].comment = comment;

            return firstPage[0];
        }
        // 영화
        else if (isManyMediaId === 3) {
            console.log('========');
            comment = `방구석 1열 열정적인 리모컨트롤러!\n${month}월 TV 기록이 가장 많은 당신,\n정주행과 본방사수는 놓칠 수 없어요!\n다음 달, 나는 어떤 유형일까요?`;
            firstPage[0].start = start;
            firstPage[0].comment = comment;

            return firstPage[0];
        }
        // 음악
        else if (isManyMediaId === 4) {
            comment = `하루의 시작과 끝은 음악과 함께!\n${month}월 음악 기록이 가장 많은 당신,\n오늘은 어떤 곡이 당신의 하루를 채웠나요?\n다음 달, 나의 새로운 유형을 기대해보세요!`;
            firstPage[0].start = start;
            firstPage[0].comment = comment;

            return firstPage[0];
        }
        // 웹툰
        else if (isManyMediaId === 5) {
            comment = `월화수목금토일 웹툰 출근 도장 완료!\n${month}월 웹툰 기록이 가장 많은 당신에게\n가장 설레는 단어는 Update 아닌가요?\n다음 달, 나의 새로운 유형을 기대해보세요!`;
            firstPage[0].start = start;
            firstPage[0].comment = comment;

            return firstPage[0];
        }
        // 유튜브
        else {
            comment = `유튜브를 통해 더 넒은 세상을 만나다!\n${month}월 유튜브 기록이 가장 많은 당신,\n오늘은 어떤 알고리즘이 당신을 이끌까요?\n다음 달, 나의 새로운 유형을 기대해보세요!`;
            firstPage[0].start = start;
            firstPage[0].comment = comment;

            return firstPage[0];
        }

    } catch (error) {
        functions.logger.error(
            `[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`,
            `[CONTENT] ${error}`
          );
          const slackMessage = `[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl} ${error}`;
   
          slackAPI.sendMessageToSlack(slackMessage, slackAPI.DEV_WEB_HOOK_ERROR_MONITORING);
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
    // 요청 파라미터 부족
    if (!date || !count) {
        return -2;
    }
    
    let client;
    try {
        client = await db.connect();
        
        const userId = req.user.id;
        
        // 기본 선택 달의 기록들 
        const lastDay = dayjs(date).daysInMonth(); // 받아온 날짜의 마지막 날
        const veryLastMonthRecord = await postDB.countPostsInDate(client, userId, date, lastDay);
        console.log(veryLastMonthRecord);
        // 지지난달의 기록들
        const isDate = dayjs(date).subtract(1, 'month').format('YYYY-MM');
        const lastday = dayjs(date).subtract(1, 'month').daysInMonth();
        const theMonthBeforeLastRecord = await postDB.countPostsInDate(client, userId, isDate, lastday);
        console.log(theMonthBeforeLastRecord);
        // 기본선택 달 기록 갯수, 지지난달 기록 갯수
        let sumVeryLastMonthRecord = Number();
        let sumTheMonthBeforeLastRecord = Number();
        
        for (let i = 0; i < veryLastMonthRecord.length; i++) {
            sumVeryLastMonthRecord += Number(veryLastMonthRecord[i].count);
        }
        for (let i = 0; i < theMonthBeforeLastRecord.length; i++) {
            sumTheMonthBeforeLastRecord += Number(theMonthBeforeLastRecord[i].count);
        }


        // 지난달 기록 갯수와 지지난달 기록 갯수 비교
        const diff = (a, b) => {
            if (a !== b) {
                let differ = a - b > 0 ? `늘었네요` : `줄었네요`
                let absolute = Math.abs(a-b);

                return `지난달보다 ${absolute}개 ${differ}.\n`;
            } else if (a === b) {
                if (a === 0 && b === 0) {
                    return `최근에 남긴 기록이 없어요.\n`
                } else {
                    return `지난달과 같네요.`;
                }
            } 
        }

        const title = `${sumVeryLastMonthRecord}개의 기록을 남겼어요`
        const firstComment = diff(sumVeryLastMonthRecord, sumTheMonthBeforeLastRecord);


        let month, newMonth, newDate, secondComment;
        // 주먹구구식 코드 => 코드 리뷰 해주세요 제발 ㅠ
        // 각각 해당 달의 기록 갯수 
        let sumOfRecord1 = Number();
        let sumOfRecord2 = Number();
        let sumOfRecord3 = Number();
        let sumOfRecord4 = Number();
        let sumOfRecord5 = Number();

        let countAndMonth1 = new Object();
        let countAndMonth2 = new Object();
        let countAndMonth3 = new Object();
        let countAndMonth4 = new Object();
        let countAndMonth5 = new Object();

        let eachCountAndMonthArray = new Array(); // 각각 해당 달과 기록 갯수 저장할 배열
        let findLargestRecordArray  = new Array(); // 가장 많이 기록한 달의 갯수 가져올 배열
        // 지난 3개월간 기록
        if (parseInt(count) === 3) {
            let mon, largestRecord;
            month = dayjs(date).subtract(2, 'month').$M+1;

            for (let i = 0; i < count; i++) {
                newDate = dayjs(date).subtract(i, 'month').format('YYYY-MM');
                newMonth = dayjs(date).subtract(i, 'month').$M+1;
                let lastday = dayjs(date).subtract(i, 'month').daysInMonth();
                
                let record = await postDB.countPostsInDate(client, userId, newDate, lastday);

                if (i === 0) {
                    for (let i = 0; i < record.length; i++) {
                        sumOfRecord1 += Number(record[i].count);
                    }
                    countAndMonth1.count = sumOfRecord1;
                    countAndMonth1.month = newMonth;
                    eachCountAndMonthArray.push(countAndMonth1);
                    findLargestRecordArray.push(sumOfRecord1);
                } else if (i === 1) {
                    for (let i = 0; i < record.length; i++) {
                        sumOfRecord2 += Number(record[i].count);
                    }
                    countAndMonth2.count = sumOfRecord2;
                    countAndMonth2.month = newMonth;
                    eachCountAndMonthArray.push(countAndMonth2);
                    findLargestRecordArray.push(sumOfRecord2);
                } else if (i === 2) {
                    for (let i = 0; i < record.length; i++) {
                        sumOfRecord3 += Number(record[i].count);
                    }
                    countAndMonth3.count = sumOfRecord3;
                    countAndMonth3.month = newMonth;
                    eachCountAndMonthArray.push(countAndMonth3);
                    findLargestRecordArray.push(sumOfRecord3);
                }
            }

            largestRecord = (findLargestRecordArray.sort((a, b) => b - a))[0];

            // eachCountAndMonthArray.forEach(obj => {
            //     if (obj.count === largestRecord) {
            //         mon = obj.month;
            //     }
            // });
            // TODO: 가장 많이 기록한 갯수가 같은 달이 두개 이상일 때
            // let mon1, mon2, mon3;
            for (let i = 0; i < eachCountAndMonthArray.length; i++) {
                if (eachCountAndMonthArray[i].count === largestRecord) {
                    mon = eachCountAndMonthArray[i].month;
                    // } else if (eachCountAndMonthArray[i].count === largestRecord && eachCountAndMonthArray[i+1].count === largestRecord) {
                    //     if (eachCountAndMonthArray[i].count === largestRecord) {
                    //         mon1 = eachCountAndMonthArray[i].month;
                    //     } 
                    //     if (eachCountAndMonthArray[i+1].count === largestRecord) {
                    //         mon2 = eachCountAndMonthArray[i+1].month;
                    //     }
                    //     secondComment = `${month}월 부터 ${count}달간 가장 많은 기록을 남긴 달은\n${mon1}, ${mon2}월로, 각각 ${largestRecord}개의 기록을 남겼어요!\n다음달 나의 그래프는 어떤 모양일까요?`;
                    // } 
                }
            }
            console.log(eachCountAndMonthArray);

            if (findLargestRecordArray[0] === 0 && findLargestRecordArray[1] === 0 && findLargestRecordArray[2] === 0) {
                secondComment = `감상한 미디어를 기록해보세요!`;
            } else {
                secondComment = `${month}월 부터 ${count}달간 가장 많은 기록을 남긴 달은\n${mon}월로, ${largestRecord}개의 기록을 남겼어요!\n다음달 나의 그래프 모양은 어떤 모양일까요?`;
            }
            
            const comment = `${firstComment}${secondComment}`;
            let start = await postDB.getCreatedAtByUserId(client, req.user.id);
            start = dayjs(start.date).format('YYYY-MM')
            const recordCount = eachCountAndMonthArray;
    
            return { start, recordCount, title, comment };  
        }
        // 5개월간 기록
        else if (parseInt(count) === 5) {
            let mon, largestRecord;
            month = dayjs(date).subtract(4, 'month').$M+1;
            console.log(month);

            for (let i = 0; i < count; i++) {
                newDate = dayjs(date).subtract(i, 'month').format('YYYY-MM');
                newMonth = dayjs(date).subtract(i, 'month').$M+1;
                let lastday = dayjs(date).subtract(i, 'month').daysInMonth();
                
                let record = await postDB.countPostsInDate(client, userId, newDate, lastday);
                //console.log(record);
                if (i === 0) {
                    for (let i = 0; i < record.length; i++) {
                        sumOfRecord1 += Number(record[i].count);
                    }
                    countAndMonth1.count = sumOfRecord1;
                    countAndMonth1.month = newMonth;
                    eachCountAndMonthArray.push(countAndMonth1);
                    findLargestRecordArray.push(sumOfRecord1);
                    
                } else if (i === 1) {
                    for (let i = 0; i < record.length; i++) {
                        sumOfRecord2 += Number(record[i].count);
                    }
                    countAndMonth2.count = sumOfRecord2;
                    countAndMonth2.month = newMonth;
                    eachCountAndMonthArray.push(countAndMonth2);
                    findLargestRecordArray.push(sumOfRecord2);
                } else if (i === 2) {
                    for (let i = 0; i < record.length; i++) {
                        sumOfRecord3 += Number(record[i].count);
                    }
                    countAndMonth3.count = sumOfRecord3;
                    countAndMonth3.month = newMonth;
                    eachCountAndMonthArray.push(countAndMonth3);
                    findLargestRecordArray.push(sumOfRecord3);
                } else if (i === 3) {
                    for (let i = 0; i < record.length; i++) {
                        sumOfRecord4 += Number(record[i].count);
                    }
                    countAndMonth4.count = sumOfRecord4;
                    countAndMonth4.month = newMonth;
                    eachCountAndMonthArray.push(countAndMonth4);
                    findLargestRecordArray.push(sumOfRecord4);
                } else if (i === 4) {
                    for (let i = 0; i < record.length; i++) {
                        sumOfRecord5 += Number(record[i].count);
                    }
                    countAndMonth5.count = sumOfRecord5;
                    countAndMonth5.month = newMonth;
                    eachCountAndMonthArray.push(countAndMonth5);
                    findLargestRecordArray.push(sumOfRecord5);
                }

            }
            largestRecord = (findLargestRecordArray.sort((a, b) => b - a))[0];
            

            eachCountAndMonthArray.forEach(obj => {
                if (obj.count === largestRecord) {
                    mon = obj.month;
                } 
            });

            if (findLargestRecordArray[0] === 0 && findLargestRecordArray[1] === 0 && findLargestRecordArray[2] === 0 && findLargestRecordArray[3] === 0 && findLargestRecordArray[4] === 0) {
                secondComment = `감상한 미디어를 기록해보세요!`;
            } else {
                secondComment = `${month}월 부터 ${count}달간 가장 많은 기록을 남긴 달은\n${mon}월로, ${largestRecord}개의 기록을 남겼어요!\n다음달 나의 그래프 모양은 어떤 모양일까요?`;
            }

            console.log(findLargestRecordArray);
            const comment = `${firstComment}${secondComment}`;
            
            let start = await postDB.getCreatedAtByUserId(client, req.user.id);
            start = dayjs(start.date).format('YYYY-MM')
            const recordCount = eachCountAndMonthArray;

            return { start, recordCount, title, comment };  
        } 
        // 3, 5 외에는 오류
        else {
            return -4;
        }

            
    } catch (error) {
        functions.logger.error(
            `[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`,
            `[CONTENT] ${error}`
        );
        const slackMessage = `[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl} ${error}`;
   
        slackAPI.sendMessageToSlack(slackMessage, slackAPI.DEV_WEB_HOOK_ERROR_MONITORING);
      // DB 에러
      return -1;
    } finally {
        client.release();
    }
};



/**
 *  @통계 나의기록 통계 세번째 
 *  @route GET /statistic/third/:date
 *  @access private
 */



const getThirdStatisticService = async (req, res) => {
  const media = ["Movie","Book","TV","Music","Webtoon","Youtube"]
  const label_media = {"Movie":"영화","Book":"책","TV":"TV","Music":"음악","Webtoon":"웹툰","Youtube":"유튜브"}
    let client;
    let data = {start:"",arr:[],title:"",label:""};
    let {date} = req.params;
    if(!date){ return -2; }
    try {
      client = await db.connect(req);

      const start = await postDB.getCreatedAtByUserId(client, req.user.id);
      data['start'] = dayjs(start.date).format('YYYY-MM')

      const counts = await postDB.getThridStatistic(client,req.user.id, date);
      console.log(counts);
      let mon = `${date}-01`;
      mon = dayjs(mon).$M+1;
      for(let i of counts){
          let obj = {type:null, count:0};
          let t = media[i['mediaId']-1];
          console.log(obj, t);
          media.splice((i['mediaId']-1),1);
          obj['type'] = t;
          obj['count'] = parseInt(i['count']);
          data['arr'].push(obj);
      }

      if(counts.length < 3){ //length 재서 3이 안 되면 나머지 수만큼 충당
        for(let i = counts.length;i<3;i++){
            let obj = {type:null, count:0};
            let t = media[i];
            obj['type'] = t;
            data['arr'].push(obj);
        }
      }

      let a_count = data['arr'][0]['count'];
      let a_type = label_media[data['arr'][0]['type']];
      let b_count = data['arr'][1]['count'];
      let b_type = label_media[data['arr'][1]['type']];
      let c_count = data['arr'][2]['count'];
      let c_type = label_media[data['arr'][2]['type']];
   
      let label;
      let a_count_type;
      let A,B,C;

      if(a_type == '영화' ||a_type == '웹툰' ||a_type == '유튜브'){
        a_count_type=a_count+'편';
      }else if(a_type == 'Music'){
        a_count_type=a_count+'곡';
      }else{ a_count_type=a_count+'권';}

      if(a_type == '영화' ||a_type == 'TV' ||a_type == '유튜브'){
        A = a_type+'를'
      }else{ A = a_type+'을' }
      if(b_type == '영화' ||b_type == 'TV' ||b_type == '유튜브'){
        B = b_type+'와'
      }else{ B = b_type+'과' }
      if(c_type == '영화' ||c_type == 'TV' ||c_type == '유튜브'){
        C = c_type+'는'
      }else{ C = c_type+'은' }

      if(a_count > b_count && b_count == c_count){
        label = `${mon}월 한 달간 ${a_count_type}의 ${A} 기록하셨네요!\n다음으로 높은 랭킹을 차지한 ${B} ${C}\n각각 ${c_count}개 기록했어요.`;
      }else{
        label = `${mon}월 한 달간 ${a_count_type}의 ${A} 기록하셨네요!\n다음으로 높은 랭킹을 차지한 ${B} ${C}\n각각 ${b_count}개, ${c_count}개 기록했어요.`;
      }
      data['title']=`${A} 가장 많이 읽었어요.`;
      data['label']= label;

      return data;

    } catch (error) {
      const slackMessage = `[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl} ${error}`;
   
      slackAPI.sendMessageToSlack(slackMessage, slackAPI.DEV_WEB_HOOK_ERROR_MONITORING);
        return -5;

    } finally {
      client.release();
    }
  };


/**
 *  @통계 나의기록 통계 네번째 
 *  @route GET /statistic/fourth/:date
 *  @access private
 */


const getFourthStatisticService = async (req, res) => {
  //한 달 유형별 한줄평 3개씩
    const media = ["Movie","Book","TV","Music","Webtoon","Youtube"]

    let client;
    let data = { start:"", oneline:{"Movie":[], "Book":[], "TV":[], "Music":[], "Webtoon":[], "Youtube":[] }};
    let {date} = req.params;
    if(!date){ return -2; }

    try {
      client = await db.connect(req);

      const start = await postDB.getCreatedAtByUserId(client, req.user.id);
      data['start'] = dayjs(start.date).format('YYYY-MM')

      const posts = await postDB.getFourthStatistic(client,req.user.id, date);

      const oneline = {"Movie":[], "Book":[], "TV":[], "Music":[], "Webtoon":[], "Youtube":[] }

  
      _.forEach(posts, (row, key)=>{

        for(let i of row['oneline']){
          //oneline[media[row['mediaId']-1]]
          if(Object.keys(oneline[media[row['mediaId']-1]]).includes(i)){ //이미 존재하는 키
            oneline[media[row['mediaId']-1]][i] += 1;
          }else{ //새로 받은 키
            oneline[media[row['mediaId']-1]][i] = 1;
          }
        }
      })
    

    const total = [oneline['Movie'], oneline['Book'], oneline['TV'], oneline['Music'], oneline['Webtoon'], oneline['Youtube']];

    for(let i in oneline){ //i는 미디어유형

      let arr = []; //순서대로 3개 푸쉬
      if(oneline[i]){ //oneline존재

        for(let j in oneline[i]){//j는 한줄평

          if(arr.length == 0){
            arr.push(j)
          }else if(arr.length == 1){
          
            if(oneline[i][arr[0]]<oneline[i][j]){
              arr.splice(0,0,j); //첫번째
            }else{
              arr.push(j); //두번째
            }
          }else if(arr.length == 2){
            if(oneline[i][arr[0]]<oneline[i][j]){
              arr.splice(0,0,j); //첫번째
            }else if(oneline[i][arr[1]]<oneline[i][j]){
              arr.splice(1,0,j); //두번째
            }else{
              arr.push(j); //세번째
            }
          }else if(arr.length == 3){
            if(oneline[i][arr[0]]<oneline[i][j]){
              arr.splice(0,0,j); //첫번째
              arr.pop();
            }else if(oneline[i][arr[1]]<oneline[i][j]){
              arr.splice(1,0,j); //두번째
              arr.pop();
            }else if(oneline[i][arr[2]]<oneline[i][j]){
              arr.splice(2,0,j); //세번째
              arr.pop();
            }
          }
          
        }
        oneline[i] = arr;
      }
    }

      data['oneline'] = oneline;
      return {data, total};

    } catch (error) {
      const slackMessage = `[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl} ${error}`;
   
      slackAPI.sendMessageToSlack(slackMessage, slackAPI.DEV_WEB_HOOK_ERROR_MONITORING);
        return -5;

    } finally {
      client.release();
    }
  };


/**
 *  @통계 나의기록 통계 전체
 *  @route GET /statistic/total/:date
 *  @access private
 */
  

const getTotalStatisticService = async (req, res) => {
  //한 달 유형별 한줄평 3개씩
    const media = ["Movie","Book","TV","Music","Webtoon","Youtube"]

    let client;
    let data = { start:"", graphic:"", oneline:[], monthly:[], media:[]};
    let { date, count } = req.params;
    if(!date || !count) { return -2; }
    if(count != 5) { return -3;}

    try {
      client = await db.connect(req);
      
      const start = await postDB.getCreatedAtByUserId(client, req.user.id);
      data['start'] = dayjs(start.date).format('YYYY-MM')

      const graphic = await getFirstStatisticService(req);
      data['graphic'] = graphic.poster;
  
      const media = await getThirdStatisticService(req);
      data['media'] = media['arr'];

      const { total } = await getFourthStatisticService(req);

      const counts = await getSecondStatisticService(req);
      data['monthly'] = counts['recordCount'];

      let total_count = {};

      let total_result = [];

      for(let row of total){
        for(let key in row){
          if(Object.keys(total_count).includes(key)){
            total_count[key] += row[key];
          }else{
            total_count[key] = row[key];
          }
        }
      }


      var sortable = [];
      for (let name in total_count) {
        sortable.push([name, total_count[name]]);
      }

      sortable.sort(function(a, b) {
        return  b[1]-a[1];
      });


      let idx = 1;
      for(let i of sortable){
        if(idx > 3){ break; }
        total_result.push(i[0]);
        idx++;
      }
      console.log(total_result)
      data['oneline'] = total_result;

      return data;

    } catch (error) {
      const slackMessage = `[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl} ${error}`;
   
      slackAPI.sendMessageToSlack(slackMessage, slackAPI.DEV_WEB_HOOK_ERROR_MONITORING);
        return -5;

    } finally {
      client.release();
    }
  };

    
module.exports = {
    getFirstStatisticService,
    getSecondStatisticService,
    getThirdStatisticService,
    getFourthStatisticService,
    getTotalStatisticService
};




