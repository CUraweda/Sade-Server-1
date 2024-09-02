const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class LessonPlanValidator {
    async lessonPlanCreateUpdateValidator(req, res, next) {
        // create schema object
        const schema = Joi.object({
            assignments_name: Joi.string().allow("", null),
            subjects_name: Joi.string().allow("", null),
            class: Joi.string().allow("", null),
            file_path: Joi.string().allow("", null),
            description: Joi.string().allow("", null),
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

module.exports = LessonPlanValidator;
