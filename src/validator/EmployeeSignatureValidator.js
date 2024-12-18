const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class EmployeeSignatureValidator {
    async createUpdateValidator(req, res, next) {
        const schema = Joi.object({
            employee_id: Joi.number().required(),
            signature_path: Joi.string().required(),
            signature_name: Joi.string().required(),
            is_headmaster: Joi.boolean().default(false),
            headmaster_of: Joi.string(),
            is_form_teacher: Joi.boolean().default(false),
            form_teacher_class_id: Joi.number(),
        });

        const options = { abortEarly: false, allowUnknown: true, stripUnknown: true };
        const { error, value } = schema.validate(req.body, options);

        if (error) {
            const errorMessage = error.details.map((details) => details.message).join(", ");
            next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        } else {
            req.body = value;
            return next();
        }
    }

    async addMineValidator(req, res, next) {
        const schema = Joi.object({
            signature_name: Joi.string().required(),
            is_headmaster: Joi.boolean().default(false),
            headmaster_of: Joi.string(),
            is_form_teacher: Joi.boolean().default(false),
            form_teacher_class_id: Joi.number(),
        });

        const options = { abortEarly: false, allowUnknown: true, stripUnknown: true };
        const { error, value } = schema.validate(req.body, options);

        if (error) {
            const errorMessage = error.details.map((details) => details.message).join(", ");
            next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        } else {
            req.body = value;
            return next();
        }
    }
}

module.exports = EmployeeSignatureValidator;
