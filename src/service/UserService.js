const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const UserDao = require("../dao/UserDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const config = require("../config/config");
const EmailHelper = require("../helper/EmailHelper");
const crypto = require("crypto");

class UserService {
  constructor() {
    this.userDao = new UserDao();
    this.mailHelper = new EmailHelper();
  }

  /**
   * Create a user
   * @param {Object} userBody
   * @returns {Object}
   */
  createUser = async (userBody) => {
    try {
      let message =
        "Successfully Registered the account! Please Verify your email.";
      if (await this.userDao.isEmailExists(userBody.email)) {
        return responseHandler.returnError(
          httpStatus.BAD_REQUEST,
          "Email already taken"
        );
      }
      const uuid = uuidv4();
      userBody.email = userBody.email.toLowerCase();
      userBody.password = bcrypt.hashSync(userBody.password, 8);
      userBody.uuid = uuid;
      userBody.status = userConstant.STATUS_ACTIVE;
      userBody.role_id = userBody.role_id;
      userBody.full_name = userBody.full_name;
      userBody.email_verified = userConstant.EMAIL_VERIFIED_FALSE

      let userData = await this.userDao.create(userBody);

      if (!userData) {
        message = "Registration Failed! Please Try again.";
        return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
      }

      userData = userData.toJSON();
      delete userData.password;

      let url 
      switch(userBody.role_id){
        case 11:
          url = config.hrdWebUrl + `/verifikasi/${uuid}`
          break;
          default:
          url = config.webUrl + `/verifikasi/${uuid}`; //Link web to verify
          break;
      }

      const mailBody = "./src/register.html";

      // Add Nodemailer
      this.mailHelper.sendEmail(
        url,
        config.email.account,
        userBody.email,
        config.email.subject,
        mailBody
      );

      return responseHandler.returnSuccess(
        httpStatus.CREATED,
        message,
        userData
      );
    } catch (e) {
      logger.error(e);
      return responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Something went wrong!"
      );
    }
  };

  /**
   * Get user
   * @param {String} email
   * @returns {Object}
   */

  isEmailExists = async (email) => {
    const message = "Email found!";
    if (!(await this.userDao.isEmailExists(email))) {
      return responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Email not Found!!"
      );
    }
    return responseHandler.returnSuccess(httpStatus.OK, message);
  };
  getUserByUuid = async (uuid) => {
    return this.userDao.findUserByUUID(uuid);
  };

  getAccountByUuid = async (uuid) => {
    const message = "Email Verified !";
    let user = await this.userDao.findOneByWhere({ uuid });

    if (!user) {
      return responseHandler.returnError(
        httpStatus.NOT_FOUND,
        "Account Not found!"
      );
    }

    const updateUser = await this.userDao.updateWhere(
      { email_verified: true },
      { uuid }
    );

    if (updateUser) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  changePassword = async (data, uuid) => {
    let message = "Login Successful";
    let statusCode = httpStatus.OK;
    let user = await this.userDao.findOneByWhere({ uuid });

    if (!user) {
      return responseHandler.returnError(
        httpStatus.NOT_FOUND,
        "User Not found!"
      );
    }

    if (data.password !== data.confirm_password) {
      return responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Confirm password not matched"
      );
    }

    const isPasswordValid = await bcrypt.compare(
      data.old_password,
      user.password
    );
    user = user.toJSON();
    
    delete user.password;

    if (!isPasswordValid) {
      statusCode = httpStatus.BAD_REQUEST;
      message = "Wrong old Password!";
      return responseHandler.returnError(statusCode, message);
    }
    const updateUser = await this.userDao.updateWhere(
      { password: bcrypt.hashSync(data.password, 8) },
      { uuid }
    );

    if (updateUser) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Password updated Successfully!",
        {}
      );
    }

    return responseHandler.returnError(
      httpStatus.BAD_REQUEST,
      "Password Update Failed!"
    );
  };

  updateUser = async (id, body) => {
    const message = "User data successfully updated!";

    let user = await this.userDao.findById(id);

    if (!user) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "User not found!",
        {}
      );
    }

    const updateData = await this.userDao.updateWhere(
      {
        full_name: body.full_name,
        email: body.email,
        role_id: body.role_id,
        status: body.status,
        email_verified: body.email_verified,
        avatar: body.file?.path || null,
      },
      { id }
    );

    const userData = user.dataValues;

    if (userData.avatar && body.avatar) {
      fs.unlink(userData.avatar, (err) => {
        if (err) {
          return responseHandler.returnError(
            httpStatus.NOT_FOUND,
            "Cannot delete avatar!"
          );
        }
        console.log("Avatar file deleted successfully.");
      });
    }

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, body);
    }
  };

  forgotPassword = async (body) => {
    const message = "Password reset link sent!";

    const user = await this.userDao.findByEmail(body.email);
    if (!user) {
      return responseHandler.returnError(
        httpStatus.NOT_FOUND,
        "User not found!"
      );
    }
    const token = crypto.randomBytes(20).toString("hex");
    const resetToken = crypto.createHash("sha256").update(token).digest("hex"); // hash the token

    const resetTokenExp = new Date(Date.now() + 10 * 60 * 1000);

    await this.userDao.updateWhere(
      { reset_token: resetToken, reset_token_exp: resetTokenExp },
      { email: body.email }
    );

    const url = config.webUrl + `/reset-password/${token}`; //Link web to reset password
    const mailBody = "./src/reset.html";

    // send email
    this.mailHelper.sendEmail(
      url,
      config.email.account,
      body.email,
      "Reset Password",
      mailBody
    );

    return responseHandler.returnSuccess(httpStatus.OK, message, {
      url,
      email: body.email,
    });
  };

  resetPassword = async (body) => {
    const message = "Password reset successfully!";
    const token = body.token;

    const resetToken = crypto.createHash("sha256").update(token).digest("hex"); // hash the token

    const user = await this.userDao.findByResetToken(resetToken);

    if (!user) {
      return responseHandler.returnError(
        httpStatus.NOT_FOUND,
        "Invalid token or token has expired !"
      );
    }

    const pass = bcrypt.hashSync(body.password, 8);

    await this.userDao.updateWhere(
      { password: pass },
      { reset_token: resetToken }
    );

    return responseHandler.returnSuccess(httpStatus.OK, message, {});
  };

  resetPasswordAdmin = async (body) => {
    const message = "Password reset successfully!";
    const user = await this.userDao.findById(body.user_id)
    if (!user) {
      return responseHandler.returnError(
        httpStatus.NOT_FOUND,
        "User not found!"
      );
    }

    const pass = bcrypt.hashSync(body.password, 8);

    await this.userDao.updateWhere(
      { password: pass },
      { id: body.user_id }
    );

    return responseHandler.returnSuccess(httpStatus.OK, message, {});
  };

  showUsersByRoles = async (roleIds, search) => {
    const message = "Subject successfully retrieved!";

    let rel = await this.userDao.findUsersByRoles(roleIds, search);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Subject not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.userDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.userDao.getUserPage(search, offset, limit);

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "User successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteUser = async (id) => {
    const message = "User successfully deleted!";

    let rel = await this.userDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(httpStatus.OK, "User not found!");
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
  showUser = async (id) => {
    const message = "User successfully retrieved!";

    let dt = await this.userDao.findById(id);

    if (!dt) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "User not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, dt);
  };
}

module.exports = UserService;
