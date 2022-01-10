const db = require('../database/db');
const { postDB, additionalDB } = require('../database');

const postUploadService = async (req, res) => {
    const { media, date, star, title, oneline, comment, additional } = req.body;

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


module.exports = {
    postUploadService
}