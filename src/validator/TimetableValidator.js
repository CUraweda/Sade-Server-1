const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class TimetableValidator {
  async timetableCreateValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
      academic_year: Joi.string().required(),
      class_id: Joi.number().required(),
      semester: Joi.number().required(),
      title: Joi.string().required(),
      start_date: Joi.date().allow("", null),
      end_date: Joi.date().allow("", null),
      hide_student: Joi.boolean().allow("", null),
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

  async timetableDuplicateCreateValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
      timetable_id: Joi.number().required(),
      start_date: Joi.date().required(),
      end_date: Joi.date().required(),
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

  async timetableUpdateValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
      academic_year: Joi.string().allow("", null),
      class_id: Joi.number().allow("", null),
      semester: Joi.number().allow("", null),
      title: Joi.string().allow("", null),
      start_date: Joi.date().allow("", null),
      end_date: Joi.date().allow("", null),
      hide_student: Joi.boolean().allow("", null),
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

module.exports = TimetableValidator;
