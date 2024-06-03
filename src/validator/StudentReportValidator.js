const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class StudentReportValidator {
  async studentReportCreateValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
      student_class_id: Joi.number().required(),
      semester: Joi.number().required(),
      number_path: Joi.string().allow("", null),
      narrative_path: Joi.string().allow("", null),
      portofolio_path: Joi.string().allow("", null),
      merged_path: Joi.string().allow("", null),
      nar_teacher_comments: Joi.string().max(3000).allow("", null),
      nar_parent_comments: Joi.string().max(3000).allow("", null),
      por_teacher_comments: Joi.string().max(3000).allow("", null),
      por_parent_comments: Joi.string().max(3000).allow("", null),
      nar_comments_path: Joi.string().max(3000).allow("", null),
      por_comments_path: Joi.string().max(3000).allow("", null),
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

  async studentReportUpdateValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
      student_class_id: Joi.number().allow("", null),
      semester: Joi.number().allow("", null),
      number_path: Joi.string().allow("", null),
      narrative_path: Joi.string().allow("", null),
      portofolio_path: Joi.string().allow("", null),
      merged_path: Joi.string().allow("", null),
      nar_teacher_comments: Joi.string().max(3000).allow("", null),
      nar_parent_comments: Joi.string().max(3000).allow("", null),
      por_teacher_comments: Joi.string().max(3000).allow("", null),
      por_parent_comments: Joi.string().max(3000).allow("", null),
      nar_comments_path: Joi.string().max(3000).allow("", null),
      por_comments_path: Joi.string().max(3000).allow("", null),
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

module.exports = StudentReportValidator;
