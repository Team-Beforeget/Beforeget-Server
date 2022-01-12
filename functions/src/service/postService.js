const functions = require('firebase-functions');
const db = require('../database/db');
const dayjs = require('dayjs');
const { postDB, additionalDB } = require('../database');

/**
 *  @포스트 전체 조회
 *  @route GET /post
 *  @access private
 */

const getAllPostService = async (req) => {
    console.log(req.user); //FIXME: 지워라잉~

    let client;
    try {
        client = await db.connect();

        const userId = req.user.id;
        
        let allPost = await postDB.getAllPostByUserId(client, userId);
        //FIXME: 등록된 포스트 없음 에러처리
        if (allPost.length === 0) {
            return -2;
        }
        // 한줄평 하나만 반환!!!!!!!!!
        const oneline = allPost.map(o => o.oneline);

        for (let i = 0; i < oneline.length; i++) {
          allPost[i].oneline = oneline[i][0];
        }
        
        return allPost;
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

const postUploadService = async (req, res) => {
    const { media, date, star, title, oneline, comment, additional } = req.body;
    //TODO: const DATE = dayjs(date).format('YYYY-MM-DD'); 하면 어케 되는진 모르겠는데 하면 클라에 이쁘게 보낼 수 있을거같은 느낌??
    if(!media||!date||!star||!title||!oneline){
        return -2;
    }
    let client;

    try {
      client = await db.connect(req);
      const id = await postDB.addPost(client, req.user.id, media, date, star, title, oneline, comment);
      
        for(let i in additional){
          const add_title=i; //추가항목 제목
          const add_content=additional[i]; //추가항목 내용
          if(add_content && add_content.length>0 && (add_title=='imgTitle1' || add_title=='imgTitle2')){ //이미지
            console.log("이미지 받았다")
          }
          else if(add_content && add_content.length>0){//내용 존재(이미지 제외)
            console.log(add_title,add_content)
            await additionalDB.postAdditional(client, id.id, add_title, add_content);
          }
          else{
            console.log("additional 내용 없음")
          }
        }
        
      return id;

    } catch (error) {
        console.log(error)
        return -5;

    } finally {
      client.release();
    }
  };

/**
 *  @포스트 나의기록 필터링
 *  @route GET /post/filter?date=,&media=,&star=,
 *  @access private
 */

const getFilterService = async (req) => {
  const { date, media, star } = req.query;
  
  let client;
  try {
    client = await db.connect();
    // date 처리
    const today = dayjs();
    today.format();

    let newDate, start, end;
    if (parseInt(date) === 1) { // 1개월 차감
      newDate = today.subtract(1, 'month').format('YYYY-MM-DD');
    } else if (parseInt(date) === 3) { // 3개월 차감
      newDate = today.subtract(3, 'month').format('YYYY-MM-DD');
    } else if (parseInt(date) === 14) { // 14일 차감
      newDate = today.subtract(14, 'day').format('YYYY-MM-DD');
    } else { // date = '2022-01-05,2022-04-02'형태일 때
      newDate = date.split(',');
      start = newDate[0];
      end = newDate[1];
    }
    // media(category)중복선택 처리 => 근데 다 누를 수 있는거임?? ㅇㅇ 다 선택 가능
    let newMedia;
    if (media.split(',').length > 1) { // 넘어온 놈이 2개 이상
      newMedia = media.split(',');
      for (let i = 0; i < newMedia.length; i++) {
        
      }
    }
    // star 중복선택 처리

    const userId = req.user.id;
    // date는..newDate, start, end넘기고 // media는,,,
    const posts = await postDB.filterUserPost(client, userId, date, media, star); 
    // default 필터링 안했을 때 포스트 전체 조회
    const allPost = await postDB.getAllPostByUserId(client, userId);
    if (!posts) {
      return allPost;
    }

    return posts;
  } catch (error) {
    console.log(error);
    // DB 에러
    return -1;
  } finally {
    client.release();
  }
};

module.exports = { getAllPostService, postUploadService, getFilterService };

