const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class ClassesValidator {
  async classesCreateUpdateValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
      level: Joi.string().required(),
      class_name: Joi.string().required(),
      book_target: Joi.number().required(),
      waste_target: Joi.number().required(),
      is_active: Joi.boolean().default(false),
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

module.exports = ClassesValidator;
