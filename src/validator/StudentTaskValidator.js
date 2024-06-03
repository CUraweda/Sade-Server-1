const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class StudentTaskValidator {
  async studentTaskCreateUpdateValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
      student_class_id: Joi.number().required(),
      task_category_id: Joi.number().required(),
      semester: Joi.number().required(),
      subject_id: Joi.number().required(),
      topic: Joi.string().required(),
      characteristic: Joi.string().required(),
      start_date: Joi.date().required(),
      end_date: Joi.date().allow("", null),
      status: Joi.string().required(),
      assign_value: Joi.number().precision(2).allow("", null),
      feed_fwd: Joi.string().allow("", null),
      up_file: Joi.string().allow("", null),
      down_file: Joi.string().allow("", null),
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

  async studentTaskUpdateValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
      student_class_id: Joi.number().allow("", null),
      task_category_id: Joi.number().allow("", null),
      semester: Joi.number().allow("", null),
      subject_id: Joi.number().allow("", null),
      topic: Joi.string().allow("", null),
      characteristic: Joi.string().allow("", null),
      start_date: Joi.date().allow("", null),
      end_date: Joi.date().allow("", null),
      status: Joi.string().allow("", null),
      assign_value: Joi.number().precision(2).allow("", null),
      feed_fwd: Joi.string().allow("", null),
      up_file: Joi.string().allow("", null),
      down_file: Joi.string().allow("", null),
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

module.exports = StudentTaskValidator;
