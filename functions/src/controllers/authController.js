const util = require("../lib/util");
const statusCode = require("../constants/statusCode");
const responseMessage = require("../constants/responseMessage");
const { joinService, loginService, logoutService } = require("../service/authService");

/**
 *  @회원가입
 *  @route POST /auth/join
 *  @access public
 */

const joinController = async (req, res) => {
  try {
    const userData = await joinService(req);
    // DB 에러
    if  (userData === -1) {
      return res
        .status(statusCode.DB_ERROR)
        .send(util.fail(
          statusCode.DB_ERROR, 
          responseMessage.DB_ERROR
        ));
    }
    // 요청 바디 부족
    else if  (userData === -2) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(
          statusCode.BAD_REQUEST, 
          responseMessage.NULL_VALUE
        ));
    }
    // 이메일 형식 오류
    else if  (userData === -3) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(
          statusCode.BAD_REQUEST, 
          responseMessage.INVALID_EMAIL
        ));
    }
    // 이미 존재하는 이메일(사용자)
    else if  (userData === -4) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(
          statusCode.BAD_REQUEST, 
          responseMessage.ALREADY_EMAIL
        ));
    }
    // 비밀번호 형식 오류
    else if  (userData === -5) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(
          statusCode.BAD_REQUEST, 
          responseMessage.INVALID_PASSWORD
        ));
    }
    // 회원가입 성공
    else {
      res
        .status(statusCode.OK)
        .send(util.success(
          statusCode.OK, 
          responseMessage.CREATED_USER, 
          userData
        ));
    }
  } catch (error) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(util.fail(
        statusCode.INTERNAL_SERVER_ERROR, 
        responseMessage.INTERNAL_SERVER_ERROR
      ));
  }
};

/**
 *  @로그인
 *  @route POST /auth/login
 *  @access public
 */

const loginController = async (req, res) => {
  try {
    const tokenData = await loginService(req);
    // DB 에러
    if  (tokenData === -1) {
      return res
        .status(statusCode.DB_ERROR)
        .send(util.fail(
          statusCode.DB_ERROR, 
          responseMessage.DB_ERROR
        ));
    }
    // 요청 바디 부족
    else if  (tokenData === -2) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(
          statusCode.BAD_REQUEST, 
          responseMessage.NULL_VALUE
        ));
    }
    // 존재하지 않는 사용자
    else if  (tokenData === -3) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(
          statusCode.BAD_REQUEST, 
          responseMessage.NO_USER
        ));
    }
    // 이메일 형식 오류
    else if  (tokenData === -4) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(
          statusCode.BAD_REQUEST, 
          responseMessage.INVALID_EMAIL
        ));
    }
    // 비밀번호 틀림
    else if  (tokenData === -5) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(
          statusCode.BAD_REQUEST, 
          responseMessage.MISS_MATCH_PW
        ));
    }
    // 로그인 성공
    else {
      res
        .status(statusCode.OK)
        .send(util.success(
          statusCode.OK, 
          responseMessage.LOGIN_SUCCESS, 
          tokenData
        ));
    }
  } catch (error) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(util.fail(
        statusCode.INTERNAL_SERVER_ERROR, 
        responseMessage.INTERNAL_SERVER_ERROR
      ));
  }
};

/**
 *  @로그아웃
 *  @route GET /auth/login
 *  @access public
 */

const logoutController = async (req, res) => {
  try {
    const data = await logoutService(req);
    // DB 에러
    if (data === -1) {
      return res
        .status(statusCode.DB_ERROR)
        .send(util.fail(
          statusCode.DB_ERROR, 
          responseMessage.DB_ERROR
        ));
    }
    // 로그아웃 실패
    else if (data === -2) {
      return res.status(statusCode.BAD_REQUEST).send(statusCode.BAD_REQUEST, responseMessage.LOGOUT_FAIL);
    } 
    // 로그아웃 성공
    else {
      res
        .status(statusCode.OK)
        .send(util.success(
          statusCode.OK, 
          responseMessage.LOGOUT_SUCCESS, 
          data
        ));
    }
  } catch (error) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(util.fail(
        statusCode.INTERNAL_SERVER_ERROR, 
        responseMessage.INTERNAL_SERVER_ERROR
      ));
  }
};

module.exports = { joinController, loginController, logoutController };
