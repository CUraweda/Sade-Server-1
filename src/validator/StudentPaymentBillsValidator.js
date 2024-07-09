const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class StudentPaymentBillsValidator {
    async studentPaymentBillsCreateUpdateValidator(req, res, next) {
        const schema = Joi.object({
            name: Joi.string().required(),
            payment_post_id: Joi.number().required(),
            level: Joi.string().required(),
            academic_year: Joi.string().required(),
            class_id: Joi.number().required(),
            student_id: Joi.number().optional(),
            total: Joi.number().required(),
            due_date: Joi.date().required(),
        })
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

module.exports = StudentPaymentBillsValidator