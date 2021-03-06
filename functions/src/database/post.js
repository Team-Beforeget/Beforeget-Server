const dayjs = require('dayjs');
const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');


const getAllPosts = async (client) => {
  const { rows } = await client.query(
    `
    SELECT * FROM post p
    WHERE is_deleted = FALSE
    `
  );
  return convertSnakeToCamel.keysToCamel(rows);
};


const getAllPostByUserId = async (client, userId) => {
  const { rows } = await client.query(
    `
    SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
    FROM post p
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );
  return convertSnakeToCamel.keysToCamel(rows);
};



const getPostByUserIdAndPostId = async (client, userId, postId) => {
  const { rows } = await client.query(
    `
    SELECT id, user_id, title, media_id as category, created_at as date, star, oneline, comment
    FROM post p
    WHERE user_id = $1
      AND id = $2
    `,
    [userId, postId]
  );
  return convertSnakeToCamel.keysToCamel(rows);
};




// FIXME  // TODO: 일단 해결은 했는데,,, start,end 값이 date,today에 들어감 ㅅㅂ 왜? 그리고 말도 안되게 길어 ㅅㅂ
const filterUserPost = async (client, userId, date, today, start, end, mediaIds, starIds) => {

  const now = dayjs();
  // date가 공백 일 때
  if (date === now.format('YYYY-MM-DD')) {
    // media가 공백
    if (mediaIds === -1) {
      // star도 공백
      if (starIds === -1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      } 
      // star가 하나
      else if (starIds.toString().length === 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND star IN (${starIds})
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
      // star가 배열
      else if (starIds.length > 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND star IN (${starIds.join()})
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
    }
    // media가 하나
    else if (mediaIds.toString().length === 1) {
      // star가 공백
      if (starIds === -1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds})
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      } 
      // star가 하나
      else if (starIds.toString().length === 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds})
          AND star IN (${starIds})
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
      // star가 배열
      else if (starIds.length > 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds})
          AND star IN (${starIds.join()})
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
    }
    // media가 배열
    else if (mediaIds.length > 1) {
      // star가 공백
      if (starIds === -1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds.join()})
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      } 
      // star가 하나
      else if (starIds.toString().length === 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds.join()})
          AND star IN (${starIds})
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
      // star가 배열
      else if (starIds.length > 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds.join()})
          AND star IN (${starIds.join()})
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
    }
    // media가 공백
    if (mediaIds === -1) {
      // star도 공백
      if (starIds === -1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      } 
      // star가 하나
      else if (starIds.toString().length === 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND star IN (${starIds})
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
      // star가 배열
      else if (starIds.length > 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND star IN (${starIds.join()})
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
    }
    // media가 하나
    else if (mediaIds.toString().length === 1) {
      // star가 공백
      if (starIds === -1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds})
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      } 
      // star가 하나
      else if (starIds.toString().length === 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds})
          AND star IN (${starIds})
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
      // star가 배열
      else if (starIds.length > 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds})
          AND star IN (${starIds.join()})
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
    }
    // media가 배열
    else if (mediaIds.length > 1) {
      // star가 공백
      if (starIds === -1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds.join()})
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      } 
      // star가 하나
      else if (starIds.toString().length === 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds.join()})
          AND star IN (${starIds})
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
      // star가 배열
      else if (starIds.length > 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds.join()})
          AND star IN (${starIds.join()})
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
    }
  } 
  
  // date가 하나 (숫자)
  else if (date === now.subtract(1, 'month').format('YYYY-MM-DD') || now.subtract(3, 'month').format('YYYY-MM-DD') || now.subtract(14, 'day').format('YYYY-MM-DD')) {
    // media가 공백
    if (mediaIds === -1) {
      // star도 공백
      if (starIds === -1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND created_at BETWEEN '${date}' AND '${today}'
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      } 
      // star가 하나
      else if (starIds.toString().length === 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND star IN (${starIds})
          AND created_at BETWEEN '${date}' AND '${today}'
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
      // star가 배열
      else if (starIds.length > 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND star IN (${starIds.join()})
          AND created_at BETWEEN '${date}' AND '${today}'
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
    }
    // media가 하나
    else if (mediaIds.toString().length === 1) {
      // star가 공백
      if (starIds === -1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds})
          AND created_at BETWEEN '${date}' AND '${today}'
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      } 
      // star가 하나
      else if (starIds.toString().length === 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds})
          AND star IN (${starIds})
          AND created_at BETWEEN '${date}' AND '${today}'
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
      // star가 배열
      else if (starIds.length > 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds})
          AND star IN (${starIds.join()})
          AND created_at BETWEEN '${date}' AND '${today}'
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
    }
    // media가 배열
    else if (mediaIds.length > 1) {
      // star가 공백
      if (starIds === -1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds.join()})
          AND created_at BETWEEN '${date}' AND '${today}'
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      } 
      // star가 하나
      else if (starIds.toString().length === 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds.join()})
          AND star IN (${starIds})
          AND created_at BETWEEN '${date}' AND '${today}'
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
      // star가 배열
      else if (starIds.length > 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds.join()})
          AND star IN (${starIds.join()})
          AND created_at BETWEEN '${date}' AND '${today}'
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
    }
  }
  // date가 기간 둘
  // eslint-disable-next-line no-dupe-else-if
  else {
    // media가 공백
    if (mediaIds === -1) {
      // star도 공백
      if (starIds === -1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND created_at BETWEEN '${start}' AND '${today}'
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      } 
      // star가 하나
      else if (starIds.toString().length === 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND star IN (${starIds})
          AND created_at BETWEEN '${start}' AND '${today}'
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
      // star가 배열
      else if (starIds.length > 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND star IN (${starIds.join()})
          AND created_at BETWEEN '${start}' AND '${today}'
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
    }
    // media가 하나
    else if (mediaIds.toString().length === 1) {
      // star가 공백
      if (starIds === -1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds})
          AND created_at BETWEEN '${start}' AND '${today}'
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      } 
      // star가 하나
      else if (starIds.toString().length === 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds})
          AND star IN (${starIds})
          AND created_at BETWEEN '${start}' AND '${today}'
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
      // star가 배열
      else if (starIds.length > 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds})
          AND star IN (${starIds.join()})
          AND created_at BETWEEN '${start}' AND '${today}'
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
    }
    // media가 배열
    else if (mediaIds.length > 1) {
      // star가 공백
      if (starIds === -1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds.join()})
          AND created_at BETWEEN '${start}' AND '${today}'
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      } 
      // star가 하나
      else if (starIds.toString().length === 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds.join()})
          AND star IN (${starIds})
          AND created_at BETWEEN '${start}' AND '${today}'
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
      // star가 배열
      else if (starIds.length > 1) {
        const { rows } = await client.query(
          `
          SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
          FROM post p
          WHERE user_id = ${userId}
          AND media_id IN (${mediaIds.join()})
          AND star IN (${starIds.join()})
          AND created_at BETWEEN '${start}' AND '${today}'
          `
          );
          return convertSnakeToCamel.keysToCamel(rows);
      }
    }
  }
};



        
        
const getOnePostById = async (client, postId, userId) => {
  const { rows } = await client.query(
    `
    SELECT id, user_id, title, media category, created_at date, star, onelie, comment
    FROM post p
    WHERE id = $1
    AND user_id = $2
    INNER JOIN (additional.title, )
    `,
    [postId, userId]
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};



const getFirstImgByPostId = async (client, postId) => {
  const { rows } = await client.query(
    `
    SELECT img_title1 as type, img_url1 FROM img
    WHERE post_id = $1
    `,
    [postId]
  );
  return convertSnakeToCamel.keysToCamel(rows);
};


const getSecondImgByPostId = async (client, postId) => {
  const { rows } = await client.query(
    `
    SELECT img_title2 as type, img_url2 FROM img
    WHERE post_id = $1
    `,
    [postId]
  );
  return convertSnakeToCamel.keysToCamel(rows);
};





const addPost = async (client, userId, mediaId, date, star, title, oneline, comment) => {

  const { rows } = await client.query(

    `

    INSERT INTO post

    (user_id, media_id, created_at, star, title, oneline, comment)

    VALUES

    ($1, $2, $3, $4, $5, $6, $7)

    RETURNING id

    `,

    [userId, mediaId, date, star, title, oneline, comment],

  );

  return convertSnakeToCamel.keysToCamel(rows[0]);

};



const updatePost = async (client, postId, media, date, star, title, oneline, comment) => {

  const { rows: existingRows } = await client.query(

    `

    SELECT * FROM post p

    WHERE id = $1

       AND is_deleted = FALSE

    `,

    [postId],

  );



  if (existingRows.length === 0) return false;


  const data = _.merge({}, convertSnakeToCamel.keysToCamel(existingRows[0]), { media, date, star, title, oneline, comment });



  const { rows } = await client.query(

    `

    UPDATE post p

    SET media_id=$1, created_at=$2, star=$3, title=$4, oneline=$5, comment=$6

    WHERE id = $7

    RETURNING * 

    `,

    [data.media, data.date, data.star, data.title, data.oneline, data.comment, postId],

  );

  return convertSnakeToCamel.keysToCamel(rows[0]);

};



const deletePost = async (client, postId) => {

  const { rows } = await client.query(

    `

    DELETE FROM post

    where id = $1
    
    RETURNING *

    `,

    [postId],

  );
  await client.query(

    `

    DELETE FROM additional

    WHERE post_id = $1

    RETURNING *

    `,

    [postId],

  );
  await client.query(

    `

    DELETE FROM img

    WHERE post_id = $1

    RETURNING *

    `,

    [postId],

  );


  return convertSnakeToCamel.keysToCamel(rows[0]);

};

const checkPostById = async (client, postId) => {

  const { rows } = await client.query(

    `

    SELECT * FROM post p

    WHERE id = $1

      AND is_deleted = FALSE

    `,

    [postId],

  );

  return convertSnakeToCamel.keysToCamel(rows[0]);

};


const countPostsByMedia = async (client, userId) => { //유형별 사용자 기록 수
  const { rows } = await client.query(
    `
    SELECT media_id, COUNT(id) FROM post
    WHERE user_id = $1
      AND is_deleted = FALSE
      GROUP BY media_id
    `,
    [userId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const getPostById = async (client, postId) => {

  const { rows } = await client.query(

    `

    SELECT * FROM post p

    WHERE id = $1

      AND is_deleted = FALSE

    `,

    [postId],

  );

  return convertSnakeToCamel.keysToCamel(rows[0]);

};

const getThridStatistic = async (client, userId, date) => {
//한 달 간
  let start = `${date}-01`;
  let end = `${date}-02`;
  start = dayjs(start).format('YYYY-MM-DD');
  end = dayjs(end).endOf("month").format('YYYY-MM-DD');
  const { rows } = await client.query(

    `

    SELECT media_id, count(id) FROM post p

    WHERE user_id = $1

      AND is_deleted = FALSE

      AND created_at BETWEEN '${start}' AND '${end}'

      GROUP BY media_id

      ORDER BY count(id) DESC
      
      LIMIT 3


    `,

    [userId],

  );

  return convertSnakeToCamel.keysToCamel(rows);

};

const getFourthStatistic = async (client, userId, date) => {
  //한 달 간
    let start = `${date}-01`;
    let end = `${date}-02`;
    start = dayjs(start).format('YYYY-MM-DD');
    end = dayjs(end).endOf("month").format('YYYY-MM-DD');
    const { rows } = await client.query(
  
      `
  
      SELECT media_id, oneline  FROM post
  
      WHERE user_id = $1
  
        AND is_deleted = FALSE
  
        AND created_at BETWEEN '${start}' AND '${end}'
  
      `,
  
      [userId],
  
    );

    return convertSnakeToCamel.keysToCamel(rows);
  
  };


const getCreatedAtByUserId = async (client, userId) => {

    const { rows } = await client.query(
  
      `
  
      SELECT created_at as date FROM post
  
      WHERE user_id = $1
  
        AND is_deleted = FALSE
  
        ORDER BY created_at ASC
        
        LIMIT 1
  
  
      `,
  
      [userId],
  
      );
  
    return convertSnakeToCamel.keysToCamel(rows[0]);
  
  };


const findPostsByDateAndCountByMedia = async (client, userId, start, end) => {
  const { rows } = await client.query(
    `
    SELECT media_id, COUNT(id) FROM post p
    WHERE user_id = ${userId}
      AND created_at BETWEEN '${start}' AND '${end}'
      GROUP BY media_id
    `
  );
  return convertSnakeToCamel.keysToCamel(rows);
};


// TODO: group by - having 써서 날짜 범위 기준으로 post개수 세보기
// const countPostsIdInDate = async (client, userId, date, lastDay) => {
//   const { rows } = await client.query(
//     `
//     SELECT created_at, SUM(id) FROM post p
//     WHERE user_id = ${userId}
//       AND created_at BETWEEN '${date}-01' AND '${date}-${lastDay}'
//       GROUP BY created_at
//     `
//   );
//   return convertSnakeToCamel.keysToCamel(rows);
// };



const countPostsInDate = async (client, userId, date, lastDay) => {
  const { rows } = await client.query(
    `
    SELECT created_at, COUNT(created_at) FROM post p
    WHERE user_id = ${userId}
      GROUP BY created_at HAVING created_at BETWEEN '${date}-01' AND '${date}-${lastDay}'
    `
  );
  return convertSnakeToCamel.keysToCamel(rows);
};





module.exports = {
  getAllPosts, 
  getPostByUserIdAndPostId,
  getAllPostByUserId,
  getOnePostById, 
  filterUserPost,
  getPostById,
  addPost, 
  updatePost, 
  deletePost, 
  countPostsByMedia,
  checkPostById,
  getThridStatistic,
  getFourthStatistic,
  getCreatedAtByUserId,
  // eslint-disable-next-line no-dupe-keys
  checkPostById,
  getFirstImgByPostId,
  getSecondImgByPostId,
  // eslint-disable-next-line no-dupe-keys
  getSecondImgByPostId,
  findPostsByDateAndCountByMedia,
  //countPostsIdInDate,
  countPostsInDate
}



