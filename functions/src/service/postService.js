const db = require('../database/db');
const { postDB, additionalDB, imgDB } = require('../database');

const postUploadService = async (req, res) => {
    const { media, date, star, title, oneline, comment, additional } = req.body;
    const { imageUrls } = req;
    const imgTitle = [];

    if(!media||!date||!star||!title||!oneline){
        return -2;
    }
    let client;

    try {
      client = await db.connect(req);
      const id = await postDB.addPost(client, req.user.id, media, date, star, title, oneline, comment);
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

    if(!result){ return -2;} //존재하지 않는 포스트

    const jsonObj = JSON.parse(additional); //추가항목 삭제, 추가 가능
    if(jsonObj){ await additionalDB.deleteAdditional(client, postId)}
    for(let i in jsonObj){
      const add_title=i; //추가항목 제목
      const add_content=jsonObj[i]; //추가항목 내용
      if(add_title=='imgTitle1' || add_title=='imgTitle2'){ //이미지
        imgTitle.push(add_content);
      }
      else if(add_content && add_content.length>0){//내용 존재(이미지 제외)
        await additionalDB.updateAdditional(client, postId, add_title, add_content);
      }
    }
//imgUrl1, imgUrl2가 ''인 경우 삭제
    if(imgTitle.length > 0 && imageUrls.length > 0){ //파일 새로 받았을 때
      let idx=0;
      if(imgTitle.length == imageUrls.length){ //존재하는 거 다 지우고
        console.log("여기야~")
        for(let i in imgTitle){
          await imgDB.postImg(client, postId, imgTitle[idx], imageUrls[idx]);
          idx++;
        }
      }
      else if(imgTitle.length > imageUrls.length){ //하나만 들어왔을 때
        if(imgUrl1){ //imgUrl1은 그대로. imgUrl2 파일 새로 받았다

        }
        else{  //imgUrl2은 그대로. imgUrl1 파일 새로 받았다

        }
        console.log("아냐 여기야")
        await imgDB.postImg(client, postId, imgTitle[idx], imageUrls[idx]);
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

module.exports = {
    postUploadService,
    postUpdateService,
    postDeleteService
}