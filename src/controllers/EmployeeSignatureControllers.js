const httpStatus = require("http-status");
const Joi = require("joi");
const EmployeeSignatureService = require("../service/EmployeeSignatureService");
const uploadEmployeeSignature = require("../middlewares/uploadEmployeeSignature");

const schemaAddMine = Joi.object({
    signature_name: Joi.string().required(),
    is_headmaster: Joi.boolean().default(false),
    headmaster_of: Joi.string(),
    is_form_teacher: Joi.boolean().default(false),
    form_teacher_class_id: Joi.number(),
});


class EmployeeSignatureController {
    constructor() {
        this.employeeSignatureService = new EmployeeSignatureService();
    }

    getAll = async (req, res) => {
        try {
            const page = +req.query.page || 0;
            const limit = +req.query.limit || 10;
            const { search } = req.query;

            const offset = limit * page;
            const resData = await this.employeeSignatureService.showPage(page, limit, offset, { search });

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getOne = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Please provide an ID");
            const resData = await this.employeeSignatureService.showOne(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    createOne = async (req, res) => {
        try {
            const resData = await this.employeeSignatureService.create(req.body);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
    
    addMine = async (req, res) => {
        try{
            await uploadEmployeeSignature(req, res);
            if (res.headersSent) {
                return;
            }
            
            var signature_path = req.file ? req.file.path : undefined;

            const formData = { ...req.body, signature_path };

            const { error } = schemaAddMine.validate(formData, {
                abortEarly: false,
                allowUnknown: true,
                stripUnknown: true,
            });

            if (error) {
                const errorMessage = error.details
                    .map((details) => {
                        return details.message;
                    })
                    .join(", ");
                return res.status(httpStatus.BAD_REQUEST).send(errorMessage);
            }

            const resData = await this.employeeSignatureService.createMine(req.user?.employee, formData)
            
            res.status(resData.statusCode).send(resData.response);
        }catch(e){
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    update = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Please provide an ID");
            const resData = await this.employeeSignatureService.update(id, req.body);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send({ error: e.message });
        }
    };

    delete = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Please provide an ID");
            const resData = await this.employeeSignatureService.delete(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = EmployeeSignatureController;
