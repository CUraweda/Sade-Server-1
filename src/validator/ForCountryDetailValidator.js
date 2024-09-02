const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class ForCountryDetailValidator {
    static defaultOptions = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    }

    async forCountryDetailsCreateUpdateValidator(req, res, next) {
        // create schema object
        const schema = Joi.object({
            for_country_id: Joi.number().integer(),
            activity: Joi.string(),
            status: Joi.string().valid("Menunggu Pelaksanaan", "Dalam Pelaksanaan", "Selesai"),
            is_date_approved: Joi.boolean(),
            file: Joi.any(),
            duration: Joi.number(),
            plan_date: Joi.string(),
            student_id: Joi.number().integer()
        }).options({ convert: true })

        // validate request body against schema
        const { error, value } = schema.validate(req.body, ForCountryDetailValidator.defaultOptions);
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
            // req.body = {
            //     ...value,
            //     for_country_id: value.for_country_id ? Number(value.for_country_id) : value.for_country_id,
            //     duration: value.duration ? Number(value.duration) : value.duration,
            // };
            return next();
        }
    }
}

module.exports = ForCountryDetailValidator;
