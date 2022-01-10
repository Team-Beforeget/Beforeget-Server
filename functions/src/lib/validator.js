const emailValidator = function (str) {
  var email =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
  if (!email.test(str)) {
    return false;
  } else {
    return true;
  }
};

module.exports = { emailValidator };
