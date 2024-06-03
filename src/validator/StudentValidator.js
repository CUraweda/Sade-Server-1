const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class StudentValidator {
  async studentCreateUpdateValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
      nis: Joi.string().required(),
      nisn: Joi.string().required(),
      full_name: Joi.string().required(),
      nickname: Joi.string().required(),
      gender: Joi.string().required(),
      pob: Joi.string().required(),
      dob: Joi.string().required(),
      nationality: Joi.string().required(),
      religion: Joi.string().required(),
      address: Joi.string().required(),
      level: Joi.string().allow("", null),
      class: Joi.string().allow("", null),
      is_active: Joi.string().required(),
      category: Joi.string().allow("", null),
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

module.exports = StudentValidator;
