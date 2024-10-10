const bcrypt = require("bcryptjs");
const httpStatus = require("http-status");
const UserDao = require("../dao/UserDao");
const TokenDao = require("../dao/TokenDao");
const { tokenTypes } = require("../config/tokens");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const RedisService = require("./RedisService");

class AuthService {
  constructor() {
    this.userDao = new UserDao();
    this.tokenDao = new TokenDao();
    this.redisService = new RedisService();
  }

  /**
   * Create a user
   * @param {String} email
   * @param {String} password
   * @returns {Promise<{response: {code: *, message: *, status: boolean}, statusCode: *}>}
   */
  loginWithEmailPassword = async (email, password) => {
    try {
      let message = "Login Successful";
      let statusCode = httpStatus.OK;
      let user = await this.userDao.findByEmail(email);
      if (user == null) {
        return responseHandler.returnError(
          httpStatus.BAD_REQUEST,
          "Invalid email or password !"
        );
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      const isEmailVerified = user.email_verified;
      user = user.toJSON();
      delete user.password;

      if (!isPasswordValid) {
        statusCode = httpStatus.UNAUTHORIZED;
        message = "Invalid email or password !";
        return responseHandler.returnError(statusCode, message);
      }

      if (!isEmailVerified) {
        statusCode = httpStatus.UNPROCESSABLE_ENTITY;
        message = "Email not verified!";
        return responseHandler.returnError(statusCode, message, user);
      }

      return responseHandler.returnSuccess(statusCode, message, user);
    } catch (e) {
      logger.error(e);
      return responseHandler.returnError(
        httpStatus.BAD_GATEWAY,
        "Something Went Wrong!!"
      );
    }
  };

  logout = async (req, res) => {
    const refreshTokenDoc = await this.tokenDao.findOne({
      token: req.body.refresh_token,
      type: tokenTypes.REFRESH,
      blacklisted: false,
    });
    if (!refreshTokenDoc) {
      return false;
    }
    await this.tokenDao.remove({
      token: req.body.refresh_token,
      type: tokenTypes.REFRESH,
      blacklisted: false,
    });
    await this.tokenDao.remove({
      token: req.body.access_token,
      type: tokenTypes.ACCESS,
      blacklisted: false,
    });
    await this.redisService.removeToken(req.body.access_token, "access_token");
    await this.redisService.removeToken(
      req.body.refresh_token,
      "refresh_token"
    );
    return true;
  };
}

module.exports = AuthService;
