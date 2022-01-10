const _ = require('lodash');

const convertSnakeToCamel = require('../lib/convertSnakeToCamel');


const postAdditional = async (client, postId, title, content) => {

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

};



module.exports = { postAdditional };