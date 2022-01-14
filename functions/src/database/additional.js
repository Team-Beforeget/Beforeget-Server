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



module.exports = { postAdditional, getAdditionalByPostId };