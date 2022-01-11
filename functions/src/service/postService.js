const functions = require('firebase-functions');
const db = require('../database/db');
const { postDB, additionalDB } = require('../database');

/**
 *  @포스트 전체 조회
 *  @route GET /post
 *  @access public
 */

const getAllPostService = async (req) => {
    console.log(req.user);

    let client;
    try {
        client = await db.connect();

        const userId = req.user.id;
        
        const allPost = await postDB.getAllPostByUserId(client, userId);
        //FIXME: 등록된 포스트 없음 에러처리
        if (allPost.length === 0) {
            return -2;
        }
        //TODO: 한줄평 배열에서 뽑기
        // const oneline = allPost.map(o => o.oneline);
        // console.log(oneline);

        // let review = new Object();
        // for (let i =0; i < oneline.length; i++) {
        //   review = oneline[i][0];
        // }
        // console.log(review);
        
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

module.exports = { getAllPostService, postUploadService };

