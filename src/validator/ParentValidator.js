const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class ParentValidator {
  async parentCreateUpdateValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
			student_id: Joi.string().optional(),
			parent_type: Joi.string().optional(),
			name: Joi.string().required(),
			nationality: Joi.string().optional(),
			religion: Joi.string().optional(),
			marriage_to: Joi.number().integer().optional(),
			in_age: Joi.number().integer().optional(),
			relationship_to_student: Joi.string().optional(),
			address: Joi.string().optional(),
			phone: Joi.string().optional(),
			email: Joi.string().optional(),
			com_priority: Joi.string().optional(),
			last_education: Joi.string().optional(),
			salary: Joi.string().optional(),
			field_of_work: Joi.string().optional(),
      user_id: Joi.number().integer().optional(),
      latitude: Joi.number().optional(),
      longitude: Joi.number().optional()
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

module.exports = ParentValidator;
