const _ = require('lodash');

const convertSnakeToCamel = require('../lib/convertSnakeToCamel');


    const getOnelinesByMediaId = async (client, mediaId) => {

      const { rows } = await client.query(

        `
        SELECT oneline FROM media
        WHERE id = $1
        `,

        [mediaId],

      );

      return convertSnakeToCamel.keysToCamel(rows[0]);

    };

const getGoodRecommendsByMediaId = async (client, mediaId) => {

    const { rows } = await client.query(
  
      `
  
      SELECT good as additional FROM media
      WHERE id = $1
  
      `,
  
      [mediaId],
  
    );
  
    return convertSnakeToCamel.keysToCamel(rows[0]);
  
  };
  
const getBadRecommendsByMediaId = async (client, mediaId) => {

  const { rows } = await client.query(

    `

    SELECT bad as additional FROM media
    WHERE id = $1

    `,

    [mediaId],

  );

  return convertSnakeToCamel.keysToCamel(rows[0]);

};
  


module.exports = { getOnelinesByMediaId, getGoodRecommendsByMediaId, getBadRecommendsByMediaId };