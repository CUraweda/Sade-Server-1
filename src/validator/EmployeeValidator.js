const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class EmployeeValidator {
  async employeeCreateUpdateValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
      employee_no: Joi.string().required(),
      full_name: Joi.string().required(),
      gender: Joi.string().required(),
      pob: Joi.string().required(),
      dob: Joi.date().required(),
      religion: Joi.string().required(),
      marital_status: Joi.string().required(),
      last_education: Joi.string().required(),
      certificate_year: Joi.string().required(),
      is_education: Joi.string().required(),
      major: Joi.string().required(),
      employee_status: Joi.string().required(),
      work_start_date: Joi.string().required(),
      occupation: Joi.string().required(),
      is_teacher: Joi.string().required(),
      duty: Joi.string().required(),
      job_desc: Joi.string().allow("", null),
      grade: Joi.string().required(),
      email: Joi.string().required(),
      user_id: Joi.number()
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
  async attachEmployeeValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
      user_id: Joi.number().required()
    });

    // schema options
    const options = {
      abortEarly: false, // include all errors
      allowUnknown: false, // ignore unknown props
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

module.exports = EmployeeValidator;
