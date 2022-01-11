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

      const jsonObj = JSON.parse(additional);
      for(let i in jsonObj){
        const add_title=i; //추가항목 제목
        const add_content=jsonObj[i]; //추가항목 내용
        if(add_title=='imgTitle1' || add_title=='imgTitle2'){ //이미지
          imgTitle.push(add_content);
        }
        else if(add_content && add_content.length>0){//내용 존재(이미지 제외)
          await additionalDB.postAdditional(client, id.id, add_title, add_content);
        }
      }
      
      if(imgTitle.length > 0 && imageUrls.length > 0){ //이미지 받았을 때
        let idx=0;
        if(imgTitle.length == imageUrls.length){
          for(let i in imgTitle){
            await imgDB.postImg(client, id.id, imgTitle[idx], imageUrls[idx]);
            idx++;
          }
        }
        else{
          await imgDB.postImg(client, id.id, imgTitle[idx], imageUrls[idx]);
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

const postDeleteService = async(req,res)=>{
  const { postId } = req.params;
  if(!postId){ return -2;}

  let client;

  try {
    client = await db.connect(req);
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
    postDeleteService
}