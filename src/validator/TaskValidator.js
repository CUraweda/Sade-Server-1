const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class TaskValidator {
  async taskCreateUpdateValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
      class_id: Joi.number().required(),
      subject_id: Joi.number().required(),
      topic: Joi.string().required(),
      start_date: Joi.date().allow("", null),
      end_date: Joi.date().allow("", null),
      category: Joi.string().allow("", null),
      status: Joi.string().allow("", null),
      task_file: Joi.string().allow("", null),
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

module.exports = TaskValidator;
