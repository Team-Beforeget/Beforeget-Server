const responseMessage = require("../constants/responseMessage");
const statusCode = require("../constants/statusCode");
const util = require("../lib/util");
const { getFirstStatisticService } = require("../service/statisticService");

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

module.exports = { getFirstStatisticController };