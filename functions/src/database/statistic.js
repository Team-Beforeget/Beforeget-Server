const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const getFirstStatisticPage = async (client, mediaId) => {
    const { rows } = await client.query(
        `
        SELECT title, poster FROM label
        WHERE media_id = $1
        `,
        [mediaId]
    );
    return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = { getFirstStatisticPage };