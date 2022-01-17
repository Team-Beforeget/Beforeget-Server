const responseMessage = require("../constants/responseMessage");
const statusCode = require("../constants/statusCode");
const util = require("../lib/util");
const { 
    getFirstStatisticService, 
    getSecondStatisticService,
    getThirdStatisticService, 
    getFourthStatisticService, 
    getTotalStatisticService } = require('../service/statisticService');


/**
 *  @통계 나의기록 통계 첫번째
 *  @route GET /statistic/first/:date
 *  @access private
 */


const getFirstStatisticController = async (req, res) => {
    try {
        const data = await getFirstStatisticService(req);
        // DB 에러
        if (data === -1) {
            return res
                .status(statusCode.DB_ERROR)
                .send(util.fail(
                    statusCode.DB_ERROR, 
                    responseMessage.DB_ERROR
                ));
        }
        // 요청 파라미터 부족
        else if (data === -2) {
            return res
                .status(statusCode.BAD_REQUEST)
                .send(util.fail(
                    statusCode.BAD_REQUEST, 
                    responseMessage.NULL_VALUE
                ));
        }
        // 찾는 페이지 없음
        else if (data === -3) {
            return res
                .status(statusCode.BAD_REQUEST)
                .send(util.fail(
                    statusCode.BAD_REQUEST, 
                    '아직 기록이 없습니다.'
                ));
        }
        // 성공
        else {
            res
                .status(statusCode.OK)
                .send(util.success(
                    statusCode.OK, 
                    responseMessage.REQUEST_SUCCESS, 
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


/**
 *  @통계 나의기록 통계 두번째 
 *  @route GET /statistic/second/:date/:count
 *  @access private
 */

const getSecondStatisticController = async (req, res) => {
    try {
        const data = await getSecondStatisticService(req);
        // DB 에러
        if (data === -1) {
            return res
                .status(statusCode.DB_ERROR)
                .send(util.fail(
                    statusCode.DB_ERROR, 
                    responseMessage.DB_ERROR
                ));
        }
        // 요청 파라미터 없음
        if (data === -2) {
            return res
                .status(statusCode.BAD_REQUEST)
                .send(util.fail(
                    statusCode.BAD_REQUEST, 
                    responseMessage.NULL_VALUE
                ));
        }
        // 찾는 페이지 없음
        else if (data === -3) {
            return res
                .status(statusCode.BAD_REQUEST)
                .send(util.fail(
                    statusCode.BAD_REQUEST, 
                    '아직 기록이 없습니다.'
                ));
        }
        // 3, 5개월 이외의 요청
        else if (data === -4) {
            return res
                .status(statusCode.BAD_REQUEST)
                .send(util.fail(
                    statusCode.BAD_REQUEST, 
                    '잘못된 요청입니다.'
                ));
        }
        // 성공
        else {
            res
                .status(statusCode.OK)
                .send(util.success(
                    statusCode.OK, 
                    responseMessage.REQUEST_SUCCESS, 
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



/**
 *  @통계 나의기록 통계 세번째 
 *  @route GET /statistic/third/:date
 *  @access private
 */



const getThirdStatisticController= async (req, res) => {

    const data = await getThirdStatisticService(req);

    if(data == -2){
        res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }else if (data == -5){
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }else{
      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.REQUEST_SUCCESS, data));
    }

};


/**
 *  @통계 나의기록 통계 네번째 
 *  @route GET /statistic/fourth/:date
 *  @access private
 */


const getFourthStatisticController= async (req, res) => {

  const {data} = await getFourthStatisticService(req);

  if(data == -2){
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
  }else if (data == -5){
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  }else{
    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.REQUEST_SUCCESS, data));
  }

};


/**
 *  @통계 나의기록 통계 네번째 
 *  @route GET /statistic/total/:date
 *  @access private
 */


const getTotalStatisticController= async (req, res) => {

  const data = await getTotalStatisticService(req);

  if(data == -2){
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
  }else if(data === -3) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, '요청값이 잘못되었습니다.'));
  }else if (data == -5){
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  }else{
    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.REQUEST_SUCCESS, data));
  }

};

module.exports = { 
    getFirstStatisticController, 
    getSecondStatisticController,
    getThirdStatisticController, 
    getFourthStatisticController,
    getTotalStatisticController 
};


