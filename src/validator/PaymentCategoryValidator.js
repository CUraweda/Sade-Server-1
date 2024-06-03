const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class PaymentCategoryValidator {
  async paymentCategoryCreateUpdateValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
      payment_post_id: Joi.number().required(),
      academic_year: Joi.string().required(),
      payment_type: Joi.string().required(),
      billing_cycle: Joi.string().required(),
      level: Joi.string().required(),
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

module.exports = PaymentCategoryValidator;
