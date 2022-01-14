const functions = require('firebase-functions');
const db = require('../database/db');
const dayjs = require('dayjs');
const _ = require('lodash');
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
    
    let isDate, newDate, now, start, end;
    if (parseInt(date) === 1) { // 1개월 차감
      newDate = today.subtract(1, 'month').format('YYYY-MM-DD');
      now = today.format('YYYY-MM-DD');
    } else if (parseInt(date) === 3) { // 3개월 차감
      newDate = today.subtract(3, 'month').format('YYYY-MM-DD');
      now = today.format('YYYY-MM-DD');
    } else if (parseInt(date) === 14) { // 14일 차감
      newDate = today.subtract(14, 'day').format('YYYY-MM-DD');
      now = today.format('YYYY-MM-DD');
    } else if (date.length === 0) { // date에 공백 들어오면 검색 안함
      newDate = today.format('YYYY-MM-DD');
    } else if (date.length === 10) { // date = 2022-04-02 형태
      now = today.format('YYYY-MM-DD');
      newDate = date;
    } else { // date = '2022-01-05,2022-04-02'형태일 때
      isDate = date.split(',');
      newDate = isDate[0];
      now = isDate[1];
    }
    // 지금 계속 start end가 안들어가고 date today가 들어감 ㅆㅂ 말이돼??


  

    // media(category)중복선택 처리 
    let newMedia;
    let mediaIds = new Array();
    if (media.split(',').length > 1) { // 넘어온 놈이 2개 이상
      newMedia = media.split(',');
      for (let i in newMedia) {
        mediaIds[i] = parseInt(newMedia[i]);
      }
    } else if (media.split(',').length === 1) { // 하나만 선택
      mediaIds = parseInt(media);
    }



    // star 중복선택 처리
    let newStar;
    let starIds = new Array();
    if (star.split(',').length > 1) { // 넘어온 놈이 2개 이상
      newStar = star.split(',');
      for (let i in newStar) {
        starIds[i] = parseInt(newStar[i]);
      }
    } else if (star.split(',').length === 1) { // 하나만 선택
      starIds = parseInt(star);
    }
    

    const userId = req.user.id;
    const posts = await postDB.filterUserPost(client, userId, newDate, now, start, end, mediaIds, starIds);
    
    // 한줄평 하나만 반환!!!!!!!!!
    const oneline = posts.map(o => o.oneline);

    for (let i = 0; i < oneline.length; i++) {
      posts[i].oneline = oneline[i][0];
    }
    // 필터 결과 해당 포스트 없음
    if (posts.length === 0) {
      return -2;
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

/**
 *  @포스트 나의기록 상세보기
 *  @route GET /post/:postId
 *  @access private
 */

const getOnePostService = async (req) => {
  const { postId } = req.params;

  let client;
  try {
    client = await db.connect();
    
    const userId = req.user.id;
     
    const img = postDB.getImgByPostId(client, postId);
    const add = additionalDB.getAdditionalByPostId(client, postId);
    //const addObj = Object
    return add;

    //const myPost = await postDB.getOnePostById(client, postId, userId);
  } catch (error) {
    console.log(error);
    // DB 에러
    return -1;
  } finally {
    client.release();
  }
};


module.exports = { 
  getAllPostService, 
  postUploadService, 
  getFilterService,
  getOnePostService 
};

