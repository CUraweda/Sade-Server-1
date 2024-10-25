const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class HeadmasterValidator {
  async headmasterCreateUpdateValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
      employee_id: Joi.number().required(),
      start_academic_year: Joi.string().required(),
      end_academic_year: Joi.string().required(),
      is_active: Joi.boolean().default(false),
      category: Joi.string().required()
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

module.exports = HeadmasterValidator
