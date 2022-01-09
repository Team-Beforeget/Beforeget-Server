const jwt = require('jsonwebtoken');
const { TOKEN_INVALID, TOKEN_EXPIRED } = require('../constants/jwt');
const secretKey = process.env.JWT_SECRET;
const options = {
  algorithm: 'HS256',
  expiresIn: '14d',
  issuer: 'chanwoo',
};
const refreshOptions = {
  algorithm: 'HS256',
  expiresIn: '30d',
  issuer: 'chanwoo',
}

const issueToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    nick: user.nick || null,
    idFirebase: user.idFirebase,
  };

  const result = {
    accesstoken: jwt.sign(payload, secretKey, options),
    refreshtoken: jwt.sign({}, secretKey, refreshOptions),
  };
  return result;
};

const verify = (token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, secretKey);
  } catch (err) {
    if (err.message === 'jwt expired') {
      console.log('expired token');
      return TOKEN_EXPIRED;
    } else if (err.message === 'invalid token') {
      console.log('invalid token');
      console.log(TOKEN_INVALID);
      return TOKEN_INVALID;
    } else {
      console.log('invalid token');
      return TOKEN_INVALID;
    }
  }
  return decoded;
};

module.exports = {
  issueToken,
  verify,
};