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

    const newDate = dayjs(date).format('YYYY-MM-01');
    const month = dayjs(date).format('MM');

    let client;
    try {
        client = await db.connect();

        const userId = req.user.id;

        const media = await postDB.findPostsByDateAndCountByMedia(client, userId, newDate);

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




const getThirdStatisticService = async (req, res) => {
  const media = ["Movie","Book","TV","Music","Webtoon","Youtube"]
  const label_media = {"Movie":"영화","Book":"책","TV":"TV","Music":"음악","Webtoon":"웹툰","Youtube":"유튜브"}
    let client;
    let data = {start:"",arr:[],label:""};
    let {date} = req.params;
    if(!date){ return -2; }
    try {
      client = await db.connect(req);

      const start = await postDB.getCreatedAtByUserId(client, req.user.id);
      data['start'] = dayjs(start.date).format('YYYY-MM')

      const counts = await postDB.getThridStatistic(client,req.user.id, date);

      let mon = `${date}-01`;
      mon = dayjs(mon).month();
      
      for(let i of counts){
          let obj = {type:null, count:0};
          let t = media[i['mediaId']-1];
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
        label = `${A} 가장 많이 읽었어요.\n${mon}월 한 달간 ${a_count_type}의 ${A} 기록하셨네요!\n다음으로 높은 랭킹을 차지한 ${B} ${C}\n각각 ${c_count}개 기록했어요.`;
      }else{
        label = `${A} 가장 많이 읽었어요.\n${mon}월 한 달간 ${a_count_type}의 ${A} 기록하셨네요!\n다음으로 높은 랭킹을 차지한 ${B} ${C}\n각각 ${b_count}개, ${c_count}개 기록했어요.`;
      }
      
      data['label']= label;

      return data;

    } catch (error) {
        console.log(error)
        return -5;

    } finally {
      client.release();
    }
  };

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
        console.log(error)
        return -5;

    } finally {
      client.release();
    }
  };
  

const getTotalStatisticService = async (req, res) => {
  //한 달 유형별 한줄평 3개씩
    const media = ["Movie","Book","TV","Music","Webtoon","Youtube"]

    let client;
    let data = { start:"", graphic:"", oneline:[], monthly:[], media:[]};
    let {date} = req.params;
    if(!date){ return -2; }

    try {
      client = await db.connect(req);
      
      const start = await postDB.getCreatedAtByUserId(client, req.user.id);
      data['start'] = dayjs(start.date).format('YYYY-MM')
  
      const media = await getThirdStatisticService(req);
      data['media'] = media['arr'];

      const { total } = await getFourthStatisticService(req);

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
        console.log(error)
        return -5;

    } finally {
      client.release();
    }
  };

    
module.exports = {
    getFirstStatisticService,
    getThirdStatisticService,
    getFourthStatisticService,
    getTotalStatisticService
};

