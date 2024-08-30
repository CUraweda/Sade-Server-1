const httpStatus = require("http-status");
const AuthService = require("../service/AuthService");
const TokenService = require("../service/TokenService");
const UserService = require("../service/UserService");
const logger = require("../config/logger");
const { tokenTypes } = require("../config/tokens");
const uploadAvatar = require("../middlewares/uploadAvatar");

class AuthController {
  constructor() {
    this.userService = new UserService();
    this.tokenService = new TokenService();
    this.authService = new AuthService();
  }

  register = async (req, res) => {
    try {
      const user = await this.userService.createUser(req.body);
      let tokens = {};
      const { status } = user.response;
      if (user.response.status) {
        tokens = await this.tokenService.generateAuthTokens(user.response.data);
      }

      const { message, data } = user.response;
      res.status(user.statusCode).send({ status, message, data, tokens });
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  checkEmail = async (req, res) => {
    try {
      const isExists = await this.userService.isEmailExists(
        req.body.email.toLowerCase()
      );
      res.status(isExists.statusCode).send(isExists.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await this.authService.loginWithEmailPassword(
        email.toLowerCase(),
        password
      );
      const { message } = user.response;
      const { data } = user.response;
      const { status } = user.response;
      const code = user.statusCode;
      let tokens = {};
      if (user.response.status) {
        tokens = await this.tokenService.generateAuthTokens(data);
      }
      res.status(user.statusCode).send({ status, code, message, data, tokens });
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  logout = async (req, res) => {
    await this.authService.logout(req, res);
    res.status(httpStatus.NO_CONTENT).send();
  };

  me = async (req, res) => {
    try {
      const user = await this.userService.getUserByUuid(req.user.uuid);
      if (user == null) {
        return res.status(httpStatus.NOT_FOUND).send('User Not Found!');
      }

      let userData = user.toJSON()
      delete userData.password

      res.status(httpStatus.OK).json({
        status: true,
        code: 200,
        message: "User information retrieved",
        data: userData,
      });
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  }

  refreshTokens = async (req, res) => {
    try {
      const refreshTokenDoc = await this.tokenService.verifyToken(
        req.body.refresh_token,
        tokenTypes.REFRESH
      );
      const user = await this.userService.getUserByUuid(
        refreshTokenDoc.user_uuid
      );
      if (user == null) {
        res.status(httpStatus.BAD_GATEWAY).send("User Not Found!");
      }
      await this.tokenService.removeTokenById(refreshTokenDoc.id);
      const tokens = await this.tokenService.generateAuthTokens(user);
      res.send(tokens);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  changePassword = async (req, res) => {
    try {
      const responseData = await this.userService.changePassword(
        req.body,
        req.user.uuid
      );
      res.status(responseData.statusCode).send(responseData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  verifyMail = async (req, res) => {
    try {
      var uuid = req.params.id;

      const responseData = await this.userService.getAccountByUuid(uuid);
      res.status(responseData.statusCode).send(responseData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    try {
      await uploadAvatar(req, res);

      var id = req.params.id;
      const { full_name, email, role_id, status, email_verified } = req.body;
      const file = req.file;
  
      const responseData = await this.userService.updateUser(id, { full_name, email, role_id, status, email_verified, file });
  
      if (req.file === undefined) {
        return res.status(httpStatus.BAD_REQUEST).send({
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: "Please upload a file!",
        });
      }

      res.status(responseData.statusCode).send(responseData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  forgotPassword = async (req, res) => {
    try {
      const responseData = await this.userService.forgotPassword(req.body);
      res.status(responseData.statusCode).send(responseData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  resetPassword = async (req, res) => {
    try {
      const responseData = await this.userService.resetPassword(req.body);
      res.status(responseData.statusCode).send(responseData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByRoles = async (req, res) => {
    try {
      const ids = req.query.ids.split(",").map((id) => parseInt(id));
      const { search } = req.query
      const resData = await this.userService.showUsersByRoles(ids, search);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = AuthController;
