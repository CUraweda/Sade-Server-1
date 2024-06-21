/* eslint-disable prettier/prettier */
/* eslint-disable class-methods-use-this */
const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class OverviewValidator {
  async overviewCreateUpdateValidator(req, res, next) {
    const schema = Joi.object({
      student_id: Joi.number().required(),
      topic: Joi.string().required(),
      meaningful_understanding: Joi.string().allow(null, ""),
      period: Joi.string().allow(null, ""),
      tup: Joi.string().allow(null, ""),
      status: Joi.string().allow(null, ""),
    });

    const options = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    const { error, value } = schema.validate(req.body, options);

    if (error) {
      const errorMessage = error.details
        .map((details) => {
          return details.message;
        })
        .join(", ");
      next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    } else {
      req.body = value;
      return next();
    }
  }
}

module.exports = OverviewValidator;
