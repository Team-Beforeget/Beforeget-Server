const _ = require('lodash');

const convertSnakeToCamel = require('../lib/convertSnakeToCamel');


const postImg = async (client, postId, title, url) => {

    const { rows } = await client.query(

    `

    INSERT INTO img
    (post_id, title, url)

    VALUES

    ($1, $2, $3)

    RETURNING id
    `,

    [postId, title, url],

    );

    return convertSnakeToCamel.keysToCamel(rows[0]);

};



module.exports = { postImg };