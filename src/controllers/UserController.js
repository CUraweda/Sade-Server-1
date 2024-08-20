const httpStatus = require("http-status");
const UserService = require("../service/UserService");
const logger = require("../config/logger");
const { tokenTypes } = require("../config/tokens");
const uploadAvatar = require("../middlewares/uploadAvatar");
const Joi = require('joi')

const schema = Joi.object({
    full_name: Joi.string().optional(),
    email: Joi.string().optional(),
    status: Joi.number().integer().optional(),
    email_verified: Joi.number().integer().optional(),
    role_id: Joi.number().integer().optional(),
})

class AuthController {
  constructor() {
    this.userService = new UserService();
  }
  show = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.userService.showUser(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showAll = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const offset = limit * page;

      const resData = await this.userService.showPage(
        page,
        limit,
        search,
        offset
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  updatePassword = async (req, res) => {
    try{
      const user = req.user
      const resData = await this.userService.changePassword(req.body, user.uuid)
      res.status(resData.statusCode).send(resData.response);
    }catch(e){
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  }
  update = async (req, res) => {
    try {
        await uploadAvatar(req, res);
        
        const user_file = req.file?.path ?? null;
        let formData;
        
        if (user_file) formData = { ...req.body, avatar: user_file };
        else formData = { ...req.body };
        
        // Convert role_id and status to integers if they exist
        if (formData.role_id) formData.role_id = parseInt(formData.role_id, 10);
        if (formData.status) formData.status = parseInt(formData.status, 10);
        if (formData.email_verified) formData.email_verified = parseInt(formData.email_verified, 10);

        const { error } = schema.validate(formData, {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        });
        
        if (error) {
            const errorMessage = error.details
                .map((details) => details.message)
                .join(", ");
            return res.status(httpStatus.BAD_REQUEST).send(errorMessage);
        }
        
        const id = req.params.id;
        const resData = await this.userService.updateUser(id, formData);
        
        res.status(resData.statusCode).send(resData.response);
    } catch (e) {
        logger.error(e);
        res.status(httpStatus.BAD_GATEWAY).send({ error: e.message });
    }
  };

  changePassword = async (req, res) => {
    try{
      const resData = await this.userService.changePassword(req.body, req.user.uuid)
      res.status(resData.statusCode).send(resData.response)
    }catch(e){
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  }

  delete = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.userService.deleteUser(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = AuthController