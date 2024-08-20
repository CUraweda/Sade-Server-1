const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class ForCountryValidator {
    static defaultOptions = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    }

    async forCountrysCreateBulkValidator(req, res, next) {
        // create schema object
        const schema = Joi.object({
            academic_year: Joi.string().required(),
            target: Joi.number().required(),
            user_ids: Joi.array().items(Joi.number()).required()
        }).options({ convert: true })

        // validate request body against schema
        const { error, value } = schema.validate(req.body, ForCountryValidator.defaultOptions);
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

module.exports = ForCountryValidator;
