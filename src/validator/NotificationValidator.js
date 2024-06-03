const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class NotificationValidator {
  async notificationCreateValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
      user_id: Joi.number().required(),
      title: Joi.string().required(),
      desc: Joi.string().required(),
      is_read: Joi.boolean().allow(null, "").default(false),
      read_at: Joi.date().allow(null, ""),
    });

    // schema options
    const options = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true, // remove unknown props
    };

    // validate request body against schema
    const { error, value } = schema.validate(req.body, options);

    if (error) {
      // on fail return comma separated errors
      const errorMessage = error.details
        .map((details) => {
          return details.message;
        })
        .join(", ");
      next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    } else {
      // on success replace req.body with validated value and trigger next middleware function
      req.body = value;
      return next();
    }
  }

  async notificationUpdateValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
      user_id: Joi.number().allow(null, ""),
      title: Joi.string().allow(null, ""),
      desc: Joi.string().allow(null, ""),
      is_read: Joi.boolean().allow(null, "").default(false),
      read_at: Joi.date().allow(null, ""),
    });

    // schema options
    const options = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true, // remove unknown props
    };

    // validate request body against schema
    const { error, value } = schema.validate(req.body, options);

    if (error) {
      // on fail return comma separated errors
      const errorMessage = error.details
        .map((details) => {
          return details.message;
        })
        .join(", ");
      next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    } else {
      // on success replace req.body with validated value and trigger next middleware function
      req.body = value;
      return next();
    }
  }
}

module.exports = NotificationValidator;
