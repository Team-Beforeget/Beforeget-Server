const functions = require('firebase-functions');
const db = require('../database/db');
const { postDB, additionalDB, imgDB } = require('../database');
const dayjs = require('dayjs');
const _ = require('lodash');


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

        let newDate;
        for (let i =0; i < allPost.length; i++) {
          newDate = dayjs(allPost[i].date).format('YYYY-MM-DD');
          allPost[i].date = newDate;
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
    const { media, date, star, title, oneline, comment, additional, imgUrl1, imgUrl2 } = req.body;
    const { imageUrls } = req;
    const imgTitle = [];

    //TODO: const DATE = dayjs(date).format('YYYY-MM-DD'); 하면 어케 되는진 모르겠는데 하면 클라에 이쁘게 보낼 수 있을거같은 느낌??
    if(!media||!date||!star||!title||!oneline){
        return -2;
    }
    let client;

    try {
      client = await db.connect(req);
      const id = await postDB.addPost(client, req.user.id, media, date, star, title, oneline, comment);
      console.log(id);
      let obj= [{},{}]
      const jsonObj = JSON.parse(additional);
      let idx=0;
      for(let i in jsonObj){
        const add_title=i; //추가항목 제목
        const add_content=jsonObj[i]; //추가항목 내용
        if(add_title=='imgTitle1' || add_title=='imgTitle2'){ //이미지
          obj[idx].title=add_title;
          obj[idx].content=add_content
          imgTitle.push(obj[idx]);
          idx++;
        }
        else if(add_content && add_content.length>0){//내용 존재(이미지 제외)
          await additionalDB.postAdditional(client, id.id, add_title, add_content);
        }
      }

      if(imgTitle.length > 0 && imageUrls.length > 0){ //이미지 받았을 때
        let idx=0;
        if(imgTitle.length ==1 && imageUrls.length ==1){
            await imgDB.postImg(client, id.id, imgTitle[idx].title, imgTitle[idx].content, imageUrls[idx]);
        }
        else if(imgTitle.length ==2 && imageUrls.length ==2){
          await imgDB.postImgs(client, id.id, imgTitle[0].content, imageUrls[0],imgTitle[1].content, imageUrls[1]);
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

  const postUpdateService = async (req, res) => {
    const { postId } = req.params;
    if(!postId){ return -3;}
  
    const { media, date, star, title, oneline, comment, additional, imgUrl1, imgUrl2 } = req.body;
    const { imageUrls } = req;
    const imgTitle = [];
  
    if(!media||!date||!star||!title||!oneline){
        return -3;
    }
    let client;
  
    try {
      client = await db.connect(req);
  
      const result = await postDB.updatePost(client, postId, media, date, star, title, oneline, comment);
  
      let obj= [{},{}];
  
      let idx=0;
      if(!result){ return -2;} //존재하지 않는 포스트
  
      const jsonObj = JSON.parse(additional); //추가항목 삭제, 추가 가능
  
      if(jsonObj){ await additionalDB.deleteAdditional(client, postId)}
      for(let i in jsonObj){
        const add_title=i; //추가항목 제목
        const add_content=jsonObj[i]; //추가항목 내용
  
        if(add_title=='imgTitle1' || add_title=='imgTitle2'){ //이미지
          obj[idx].title=add_title;
          obj[idx].content=add_content
          imgTitle.push(obj[idx]);
          idx++;
          await imgDB.updateImgTitle(client, postId, add_title, add_content)
        }
        else if(add_content && add_content.length>0){//내용 존재(이미지 제외)
          await additionalDB.updateAdditional(client, postId, add_title, add_content);
        }
      }
  
      if(imgUrl1 && imgUrl1==' '){ //img1삭제
        await imgDB.deleteImg(client, postId, 'imgUrl1');
      }
      if(imgUrl2 && imgUrl2==' '){
        await imgDB.deleteImg(client, postId, 'imgUrl2');
      }
    
      
      if(imgTitle.length > 0 && imageUrls.length > 0){ //파일 새로 받았을 때
        let idx=0;
        if(imgTitle.length == imageUrls.length){ //존재하는 거 다 지우고
          for(let i in imgTitle){
            await imgDB.updateImg(client, postId, imgTitle[idx].title, imgTitle[idx].content, imageUrls[idx]);
            idx++;
          }
        }
        else if(imgTitle.length > imageUrls.length){ //하나만 들어왔을 때
          if(imgUrl1){ //imgUrl1은 그대로. imgUrl2 파일 새로 받았다
            await imgDB.updateImg(client, postId, 'imgUrl2',imgTitle[1], imageUrls[0]);
          }
          else{  //imgUrl2은 그대로. imgUrl1 파일 새로 받았다
            await imgDB.updateImg(client, postId, 'imgUrl1',imgTitle[0], imageUrls[0]);
          }
        }
      }
  
      return result;
  
    } catch (error) {
        console.log(error)
        return -5;
  
    } finally {
      client.release();
    }
  };
  
  const postDeleteService = async(req,res)=>{
    const { postId } = req.params;
    if(!postId){ return -3;}
  
    let client;
  
    try {
      client = await db.connect(req);
      const result = await postDB.checkPostById(client, postId);
      if(!result){ return -2;} //존재하지 않는 포스트
  
      const id = await postDB.deletePost(client, postId);
  
      return id;
  
    } catch (error) {
        console.log(error)
        return -5;
  
    } finally {
      client.release();
    }
  }
  

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
    } else if (parseInt(date) === 2) { // 3개월 차감
      newDate = today.subtract(3, 'month').format('YYYY-MM-DD');
      now = today.format('YYYY-MM-DD');
    } else if (parseInt(date) === 0) { // 14일 차감
      newDate = today.subtract(14, 'day').format('YYYY-MM-DD');
      now = today.format('YYYY-MM-DD');
    } else if (parseInt(date) === -1) { // date에 공백 들어오면 검색 안함
      newDate = today.format('YYYY-MM-DD');
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
    } else {
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
    } else {
      starIds = parseInt(star);
    }
    

    const userId = req.user.id;
    const posts = await postDB.filterUserPost(client, userId, newDate, now, start, end, mediaIds, starIds);
    //console.log(posts);
    let withoutTimezoneDate;
    for (let i = 0; i < posts.length; i++) {
      withoutTimezoneDate = dayjs(posts[i].date).format('YYYY-MM-DD');
      posts[i].date = withoutTimezoneDate;
    }
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
 *  @포스트 나의기록 상세보기
 *  @route GET /post/:postId
 *  @access private
 */

const getOnePostService = async (req) => {
  const { postId } = req.params;
  // 요청 파라미터 없음
  if (!postId) {
    return -2;
  }

  let client;
  try {
    client = await db.connect();
    
    const userId = req.user.id;

    const posts = await postDB.getPostByUserIdAndPostId(client, userId, postId);
    // 포스트 없음
    if (!posts) {
      return -3;
    }
    const newDate = dayjs(posts[0].date).format('YYYY-MM-DD');

    const img = await postDB.getFirstImgByPostId(client, postId);
    const img2 = await postDB.getSecondImgByPostId(client, postId);
    const add = await additionalDB.getAdditionalByPostId(client, postId);

    // 추가 항목 없음
    if (img.length === 0 && img2.length === 0 && add.length === 0) {
      posts[0].date = newDate;
      return posts;
    } 
    // 이미지 하나만 추가
    else if (img.length > 0 && img2.length === 0 && add.length === 0) {
      add.push(img[0]);
      posts[0].date = newDate;
      posts[0].additional = add;

      return posts;
    } 
    // 이미지 두개만 추가 && 데이터 가공 for 클라이언트
    else if (img.length > 0 && img2.length > 0 && add.length === 0) {
      img.push(img2[0]);
      for (let i = 0; i < img.length; i++) {
        add.push(img[i]);
      }
      posts[0].date = newDate;
      posts[0].additional = add;
  
      return posts;
    }
    // 이미지 하나만 추가, add 존재
    else if (img.length > 0 && img2.length === 0 && add.length > 0) {
      add.push(img[0]);
      posts[0].date = newDate;
      posts[0].additional = add;

      return posts;
    }
    // add만 존재
    else if (img.length === 0 && img2.length === 0 && add.length > 0) {
      posts[0].date = newDate;
      posts[0].additional = add;

      return posts;
    }
    // 추가 항목 모두 있음
    else {
      img.push(img2[0]);
      for (let i = 0; i < img.length; i++) {
        add.push(img[i]);
      }
      posts[0].date = newDate;
      posts[0].additional = add;

      return posts;
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


module.exports = { 
  getAllPostService, 
  postUploadService, 
  getFilterService,
  getOnePostService,
  postUpdateService,
  postDeleteService
};

