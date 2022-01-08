const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const addUser = async (client, email, nick, token) => {
    const { rows } = await client.query(
      `
      INSERT INTO "user" u
      (email, nick, token)
      VALUES
      ($1, $2, $3)
      RETURNING *
      `,
  
      [email, nick, token],
    );
    return convertSnakeToCamel.keysToCamel(rows[0]);
  };

module.exports = { addUser };
