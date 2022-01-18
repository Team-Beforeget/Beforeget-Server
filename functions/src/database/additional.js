const _ = require('lodash');

const convertSnakeToCamel = require('../lib/convertSnakeToCamel');


const postAdditional = async (client, postId, title, content, self) => {

  if(self){
    const { rows } = await client.query(

      `
  
      INSERT INTO additional
      (post_id, title, content, self)
  
      VALUES
  
      ($1, $2, $3, true)
  
      RETURNING id
      `,
  
      [postId, title, content],
  
      );
      return convertSnakeToCamel.keysToCamel(rows[0]);
  }
  else{ 
    const { rows } = await client.query(

    `

    INSERT INTO additional
    (post_id, title, content)

    VALUES

    ($1, $2, $3)

    RETURNING id
    `,

    [postId, title, content],

    );
    return convertSnakeToCamel.keysToCamel(rows[0]);
   }
};

const getAdditionalByPostId = async (client, postId) => {
    const { rows } = await client.query(
        `
        SELECT title as type, content FROM additional
        WHERE post_id = $1
        `,
        [postId]
    );
    return convertSnakeToCamel.keysToCamel(rows);
};

const updateAdditional = async (client, postId, title, content) => {

    const { rows: existingRows } = await client.query(
  
      `
  
      SELECT * FROM additional a
  
      WHERE post_id = $1

        AND title = $2
          
      `,
  
      [postId, title],
  
    );
  
  
  
  if (existingRows.length === 0 && content !='' && content != ' '){ //같은 타이틀 없을 때 새로 생성
      const { rows } = await client.query(

        `
    
        INSERT INTO additional
        (post_id, title, content)
    
        VALUES
    
        ($1, $2, $3)
    
        RETURNING id
        `,
    
        [postId, title, content],
    
        );
      return convertSnakeToCamel.keysToCamel(rows[0]);
    }
  
  
  else{ //존재하는 title일 때. 호옥시나 delete 실패 시
      const data = _.merge({}, convertSnakeToCamel.keysToCamel(existingRows[0]), { title, content });
    console.log(data.title,data.content)
    if(content == ' ' || content == ''){ //삭제
      const { rows } = await client.query(
  
        `
    
        DELETE FROM additional
    
        WHERE post_id = $1
  
          AND title = $2
    
        RETURNING * 
    
        `,
    
        [postId, data.title],
    
      );
      return convertSnakeToCamel.keysToCamel(rows[0]);
    }
    else{
      const { rows } = await client.query(
  
      `
  
      UPDATE additional a
  
      SET content = $1, created_at = now()
  
      WHERE post_id = $2

        AND title = $3
  
      RETURNING * 
  
      `,
  
      [data.content, postId, data.title],
  
    );
    return convertSnakeToCamel.keysToCamel(rows[0]);
    }
  }
  
  };

  const deleteAdditional = async (client, postId) => {

    const { rows: existingRows } = await client.query(
  
      `
  
      SELECT * FROM additional a
  
      WHERE post_id = $1
          
      `,
  
      [postId],
  
    );
  
  
  
  if (existingRows.length === 0){ return ;
    }
  
    const { rows } = await client.query(

      `
  
      DELETE FROM additional
  
      WHERE post_id = $1
  
      RETURNING * 
  
      `,
  
      [postId],
  
    );
    return convertSnakeToCamel.keysToCamel(rows[0]);
  };


module.exports = { postAdditional, getAdditionalByPostId, updateAdditional, deleteAdditional };