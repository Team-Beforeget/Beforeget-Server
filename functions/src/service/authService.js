const functions = require("firebase-functions");
const db = require("../database/db");
const { userDB } = require("../database");
const admin = require('firebase-admin');
const { signInWithEmailAndPassword } = require('@firebase/auth');
const jwtHandlers = require("../lib/jwtHandlers");
const { emailValidator } = require("../lib/validator");
const { firebaseAuth } = require("../config/firebaseClient");

/**
 *  @회원가입
 *  @route POST /auth/join
 *  @access public
 */

const joinService = async (req) => {
    const { email, nick, password } = req.body;
    console.log(email, nick, password);
    //요청 바디 부족
    if (!email || !nick || !password) {
        return -2;
    }
  
    let client;
    try {
        client = await db.connect();
        // 이메일 형식 오류
        const validatedEmail = emailValidator(email);
        if (!validatedEmail) {
            return -3;
        }
        // firebase에 유저 생성
        const userFirebase = await admin
            .auth()
            .createUser({ email, password })
            .then((user) => user)
            .catch((e) => {
                console.log(e);
                return { err: true, error: e};
            });

        if (userFirebase.err) {
        // 이미 존재하는 사용자
        if (userFirebase.error.code === "auth/email-already-exists") {
            return -4;
        }
        // 비밀번호 형식 오류
        else if (userFirebase.error.code === "auth/invalid-password") {
            return -5;
        } else {
            throw new Error("firebase 오류");
        }
        }

        const idFirebase = userFirebase.uid;
        // 회원가입 성공 시 db에 유저 저장
        const newUser = await userDB.addUser(client, email, nick, idFirebase);

        return newUser;
    } catch (error) {
        functions.logger.error(
            `[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`,
            `[CONTENT] ${error}`
        );
        console.log(error);
        // DB 에러
        return -1;
    } finally {
        client.release();
    }
  };

/**
 *  @로그인
 *  @route POST /auth/login
 *  @access public
 */

const loginService = async (req) => {
    const { email, password } = req.body;
    // 요청 바디 부족
    if (!email || !password) {
        return -2;
    }

    let client;
    try {
        client = await db.connect();

        const userFirebase = await signInWithEmailAndPassword(firebaseAuth, email, password)
            .then((user) => user)
            .catch((e) => {
                console.log(e);
                return { err: true, error: e};
            });

        if (userFirebase.err) {
            // 해당 유저가 없음
            if (userFirebase.error.code === 'auth/user-not-found') {
                return -3;
            }
            // 이메일 형식 오류
            else if (userFirebase.error.code === 'auth/invalid-email') {
                return -4;
            }
            // 패스워드 틀림
            else if (userFirebase.error.code === 'auth/wrong-password') {
                return -5;
            }
            // firebase 오류
            else {
                throw new Error('firebase 오류');
            }
        }
        // idFirebase에 user의 uid 저장
        const idFirebase = userFirebase.user.uid;
        // idFirebase로 유저 불러오기
        const user = await userDB.getUserByIdFIrebase(client, idFirebase);
        // 토큰 발급
        const { accesstoken, refreshtoken } = jwtHandlers.issueToken(user);
        const jwtToken = { accesstoken, refreshtoken };
        // user 디비에 token저장
        await userDB.updateUserToken(client, idFirebase, refreshtoken);
        // 특정 유저의 토큰 반환
        user.jwtToken = jwtToken;
        return user;
    } catch (error) {
        functions.logger.error(
            `[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`,
            `[CONTENT] ${error}`
        );
        console.log(error);
        // DB 에러
        return -1;
    } finally {
        client.release();
    }
};

module.exports = { joinService, loginService };