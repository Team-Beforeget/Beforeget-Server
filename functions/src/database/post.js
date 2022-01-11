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
    `,
    [userId]
  );
  return convertSnakeToCamel.keysToCamel(rows);
};


// FIXME
const filterUserPost = async (client, userId, date, media, star) => {
  const { rows } = await client.query(
    `
    SELECT id, user_id, media_id as category, created_at as date, star, title, oneline
    FROM post p
    WHERE user_id = $1
      AND date IN ${date}
        OR category IN ${media}
        OR star IN ${star}
    `,
    [userId]
  );
  return convertSnakeToCamel.keysToCamel(rows)
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



const addPost = async (client, userId, mediaId, date, star, title, oneline, comment) => {
  const { rows } = await client.query(
    `
    INSERT INTO post
    (user_id, media_id, star, title, oneline, comment)
    VALUES
    ($1, $2, $3, $4, $5, $6)
    (user_id, media_id, created_at, star, title, oneline, comment)
    VALUES
    ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
    `,
    [userId, mediaId, date, star, title, oneline, comment],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};



const updatePost = async (client, title, content, postId) => {
  const { rows: existingRows } = await client.query(
    `
    SELECT * FROM post p
    WHERE id = $1
       AND is_deleted = FALSE
    `,
    [postId],
  );
  if (existingRows.length === 0) return false;

  const data = _.merge({}, convertSnakeToCamel.keysToCamel(existingRows[0]), { title, content });

  const { rows } = await client.query(
    `
    UPDATE post p
    SET title = $1, content = $2, updated_at = now()
    WHERE id = $3
    RETURNING * 
    `,
    [data.title, data.content, postId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};



// const updateOneline = async (client, userId, post) => {
//   const { rows: existingRows } = await client.query(
//     `
//     SELECT * FROM post p
//     WHERE user_id = $1
//     `,
//     [userId]
//   );
  
//   const data = _.mergeWith({}, existingRows[0], () => {
//     //TODO: 한줄평 배열에서 뽑기
//     let oneline = post.map(o => o.oneline);
//     console.log(oneline);
//     let result1, result2;
//     for (let i = 0; i < oneline.length; i++) {
//       result1 = oneline[i][0];
//       for (i; i < oneline.length; i++) {
//         post[i].oneline = result1;
//         result2 = post[i].oneline;
//         return result2;
//       }
//     }
//   });

//   const { rows } = await client.query(
//     `
//     UPDATE post p
//     SET oneline = $1
//     WHERE user_id = $2
//     RETURNING id, media_id as category, created_at as date, star, title, oneline
//     `,
//     [data.result2, userId]
//   );
//   return convertSnakeToCamel.keysToCamel(rows[0]);
// };



const deletePost = async (client, postId) => {
  const { rows } = await client.query(
    `
    UPDATE post p
    SET is_deleted = TRUE, updated_at = now()
    WHERE id = $1
    RETURNING *
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

module.exports = { 
  getAllPosts, 
  getAllPostByUserId,
  getPostById, 
  filterUserPost,
  addPost, 
  updatePost, 
  // updateOneline,
  deletePost, 
  countPostsByMedia };