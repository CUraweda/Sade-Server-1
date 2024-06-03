const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class ClassTimetableValidator {
  async classTimetableCreateUpdateValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
      class_id: Joi.number().required(),
      day_id: Joi.number().required(),
      subject_id: Joi.number().required(),
      semester: Joi.number().required(),
      time_seq: Joi.number().required(),
      date_at: Joi.date().required(),
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

module.exports = ClassTimetableValidator;
