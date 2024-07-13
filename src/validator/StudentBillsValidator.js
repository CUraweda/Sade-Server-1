const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class StudentBillsValidator {
    async studentBillsCreateUpdateValidator(req, res, next) {
        const schema = Joi.object({
            student_id: Joi.number().required(),
            payment_bill_id: Joi.number().required(),
            evidence_path: Joi.string().allow("", null),
            paidoff_at: Joi.string().allow("", null),
            status: Joi.string().required()
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

    async studentBillsBulkCreateValidator(req, res, next) {
        const schema = Joi.object({
            student_ids: Joi.array().items(Joi.number()).required(),
            payment_bill_id: Joi.number().required(),
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

module.exports = StudentBillsValidator