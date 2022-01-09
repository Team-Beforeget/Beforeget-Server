const functions = require('firebase-functions');
const responseMessage = require("../constants/responseMessage");
const statusCode = require("../constants/statusCode");
const util = require("../lib/util");
const db = require('../database/db');
const jwtHandlers = require('../lib/jwtHandlers');
const { TOKEN_EXPIRED, TOKEN_INVALID } = require('../constants/jwt');
const { userDB } = require('../database');

// 클라이언트로부터 req 받아와서 처리
const checkUserByToken = async (req, res, next) => {
    // req.headers에 accesstoken, refreshtoken 이름으로 담긴 값 가져옴
    const { accesstoken, refreshtoken } = req.headers;
    // accesstoken 없음
    if (!accesstoken) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.TOKEN_EMPTY));
    }

    let client;
    try {
        client = await db.connect();
        // 토큰 verify 
        const decodedAccesstoken = jwtHandlers.verify(accesstoken);
        const decodedRefreshtoken = jwtHandlers.verify(refreshtoken);
        // token 만료에 따른 분기
        if (decodedAccesstoken === TOKEN_EXPIRED || decodedAccesstoken === TOKEN_INVALID) { // accesstoken 만료
            if (decodedRefreshtoken === TOKEN_EXPIRED) { // refreshtoken도 만료
                return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, responseMessage.TOKEN_EXPIRED));
            } else { // accesstoken만 만료 
                // refreshtoken으로 유저 가져오기
                const user = await userDB.getUserByToken(client, refreshtoken);
                if (!user) {
                    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_USER));
                }
                // accesstoekn 재발급
                const { accesstoken: newAccesstoken } = jwtHandlers.issueToken(user);
                
                res.cookie('accesstoken', newAccesstoken);
                req.cookies.accesstoken = newAccesstoken;
                next();
            }
        } else if (decodedRefreshtoken === TOKEN_EXPIRED) { // refreshtoken만 만료
            // refreshtoken 재발급
            const { refreshtoken: newRefreshtoken } = jwtHandlers.issueToken();
            // 해당 user 가져오기
            const userIdFirebase = decodedAccesstoken.idFirebase;
            if (!userIdFirebase) {
                return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, responseMessage.TOKEN_EXPIRED));
            }
            // user 디비에 새로 발급해준 refreshtoken 저장
            await userDB.updateUserToken(client, userIdFirebase, newRefreshtoken);

            res.cookie('refreshtoken', newRefreshtoken);
            req.cookies.refreshtoken = newRefreshtoken;
            next();
        } else { // accesstoken, refreshtoken 모두 유효
            const userIdFirebase = decodedAccesstoken.idFirebase;
            if (!userIdFirebase) {
                return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, responseMessage.TOKEN_EXPIRED));
            }
            // 해당 user 가져오기
            const user = await userDB.getUserByIdFIrebase(client, userIdFirebase);
            if (!user) {
                return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_USER));
            }
            // 다음 미들웨어부터 사용할 req.user에 user정보 넣기
            req.user = user;
            next();
        }
    } catch (error) {
        console.log(error);
        functions.logger.error(`[AUTH ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, accesstoken);
        res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    } finally {
        client.release();
    }
};

module.exports = { checkUserByToken };