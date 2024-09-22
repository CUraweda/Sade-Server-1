const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class EduCalendarDetailValidator {
  async eduCalendarDetailCreateUpdateValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
      teacher_id: Joi.number().required(),
      edu_id: Joi.number().required(),
      start_date: Joi.date().required(),
      end_date: Joi.date().required(),
      agenda: Joi.string().required(),
      color: Joi.string().allow("", null),
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

  async eduCalendarDetailUpdateValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
      edu_id: Joi.number().allow("", null),
      start_date: Joi.date().allow("", null),
      end_date: Joi.date().allow("", null),
      agenda: Joi.string().allow("", null),
      color: Joi.string().allow("", null),
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

module.exports = EduCalendarDetailValidator;
