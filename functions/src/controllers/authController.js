const util = require("../lib/util");
const statusCode = require("../constants/statusCode");
const responseMessage = require("../constants/responseMessage");
const db = require('../database/db');
const { userDB } = require('../database');

const joinController = async (req, res) => {
    const { email, nick } = req.body;
    let client;
    try{
        client = await db.connect();
        const user = await userDB.addUser(client, email, nick); // password는 db에 저장 안함 
        res
        .status(statusCode.OK)
        .send(
            util.success(
                statusCode.OK, 
                responseMessage.CREATED_USER, 
                user)
        );
    } catch (error) {
        return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.INTERNAL_SERVER_ERROR
          )
        );
    } finally {
        client.release();
    }
}

module.exports = { joinController };