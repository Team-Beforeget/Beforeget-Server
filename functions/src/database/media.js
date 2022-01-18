const _ = require('lodash');

const convertSnakeToCamel = require('../lib/convertSnakeToCamel');


const getGoodOnelinesByMediaId = async (client, mediaId) => {

      const { rows } = await client.query(

        `
        SELECT good FROM media
        WHERE id = $1
        `,

        [mediaId],

      );

      return convertSnakeToCamel.keysToCamel(rows[0]);

    };

 const getBadOnelinesByMediaId = async (client, mediaId) => {

      const { rows } = await client.query(

        `
        SELECT bad FROM media
        WHERE id = $1
        `,

        [mediaId],

      );

      return convertSnakeToCamel.keysToCamel(rows[0]);

    };

const getRecommendsByMediaId = async (client, mediaId) => {

    const { rows } = await client.query(
  
      `
  
      SELECT recommend as additional FROM media
      WHERE id = $1
  
      `,
  
      [mediaId],
  
    );
  
    return convertSnakeToCamel.keysToCamel(rows[0]);
  
  };
  


module.exports = { getGoodOnelinesByMediaId, getBadOnelinesByMediaId, getRecommendsByMediaId};