const _ = require('lodash');

const convertSnakeToCamel = require('../lib/convertSnakeToCamel');


const postAdditional = async (client, mediaId) => {

    const { rows } = await client.query(

    `

    SELECT oneline FROM media
    WHERE id = $1
    `,

    [mediaId],

    );

    return convertSnakeToCamel.keysToCamel(rows[0]);

};



module.exports = { postAdditional };