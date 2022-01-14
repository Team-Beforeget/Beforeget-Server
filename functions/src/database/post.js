const _ = require('lodash');

const convertSnakeToCamel = require('../lib/convertSnakeToCamel');



const getAllPosts = async (client) => {

  const { rows } = await client.query(

    `

    SELECT * FROM post p

    WHERE is_deleted = FALSE

    `,

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

    UPDATE post p

    SET is_deleted = TRUE

    WHERE id = $1

    RETURNING *

    `,

    [postId],

  );
  await client.query(

    `

    UPDATE additional a

    SET is_deleted = TRUE

    WHERE post_id = $1

    RETURNING *

    `,

    [postId],

  );
  await client.query(

    `

    UPDATE img i

    SET is_deleted = TRUE

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


module.exports = { getAllPosts, getPostById, addPost, updatePost, deletePost, countPostsByMedia, checkPostById };