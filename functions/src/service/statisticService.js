const db = require('../database/db');
const { postDB } = require('../database');
const dayjs = require('dayjs');


const getThirdStatisticService = async (req, res) => {
  const media = ["Movie","Book","TV","Music","Webtoon","Youtube"]
  const label_media = {"Movie":"영화","Book":"책","TV":"TV","Music":"음악","Webtoon":"웹툰","Youtube":"유튜브"}
    let client;
    let data = {start:"",arr:[],label:""};
    let {date} = req.params;
    if(!date){ return -2; }
    try {
      client = await db.connect(req);
      const counts = await postDB.getThridStatistic(client,req.user.id, date);

      const start = await postDB.getCreatedAtByUserId(client, req.user.id);

      data['start'] = dayjs(start.date).format('YYYY-MM')
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


module.exports = {
    getThirdStatisticService
}