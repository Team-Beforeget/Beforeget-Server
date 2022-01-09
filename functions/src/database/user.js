const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const addUser = async (client, email, nick, idFirebase) => {
    const { rows } = await client.query(
      `
      INSERT INTO "user"
      (email, nick, id_Firebase)
      VALUES
      ($1, $2, $3)
      RETURNING *
      `
      [email, nick, idFirebase]
    );
    return convertSnakeToCamel.keysToCamel(rows[0]);
  };

const getUserByIdFIrebase = async (client, idFirebase) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "user" u
    WHERE id_firebase = $1
      AND is_deleted = FALSE
    `,
    [idFirebase]
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const updateUserToken = async (client, idFirebase, refreshtoken) => {
  const { rows: existingRows } = await client.query(
    `
    SELECT * FROM "user" u
    WHERE id_firebase = $1
      AND is_deleted = FALSE
    `,
    [idFirebase]
  );
  if (existingRows.length === 0) {
    return false;
  }

  const data = _.merge({}, convertSnakeToCamel.keysToCamel(existingRows[0]), { refreshtoken });

  const { rows } = await client.query(
    `
    UPDATE "user" u
    SET token = $1
    WHERE id_firebase = $2
    RETURNING *
    `,
    [data.refreshtoken, idFirebase]
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const getUserByToken = async (client, refreshtoken) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "user" u
    WHERE token = $1
      AND is_deleted = FALSE
    `,
    [refreshtoken]
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const getAllUsers = async (client) => {
    const { rows } = await client.query(
      `
      SELECT * FROM "user" u
      WHERE is_deleted = FALSE
      `,
    );
    return convertSnakeToCamel.keysToCamel(rows);
};


module.exports = { addUser, getUserByIdFIrebase, updateUserToken, getUserByToken, getAllUsers };
