const httpStatus = require('http-status');
const LessonPlanService = require('../service/LessonPlanService');
const Joi = require('joi');
const path = require('path');
const logger = require('../config/logger');
const fs = require('fs');

const uploadLessonPlan = require('../middlewares/uploadLessonPlan');

const schema = Joi.object({
    assignments_name: Joi.string().required(),
    subjects_name: Joi.string().required(),
    class: Joi.string().required(),
    description: Joi.string().allow('', null),
});

class LessonPlanController {
    constructor() {
        this.lessonPlanService = new LessonPlanService();
    }

    showAll = async (req, res) => {
        try {
            const page = +req.query.page || 0;
            const limit = +req.query.limit || 10;
            const search = req.query.search || '';
            const offset = limit * page;

            const resData = await this.lessonPlanService.showAll(
                page,
                limit,
                { search },
                offset
            );

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    showOne = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Please provide an ID");

            const resData = await this.lessonPlanService.showOne(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    create = async (req, res) => {
        try {
            await uploadLessonPlan(req, res);

            const lessonPath = req.file ? req.file.path : null;

            const formData = { ...req.body, file_path: lessonPath };

            const { error } = schema.validate(formData, {
                abortEarly: false,
                allowUnknown: true,
                stripUnknown: true,
            });

            if (error) {
                const errorMessage = error.details
                    .map((details) => {
                        return details.message;
                    })
                    .join(', ');
                return res.status(httpStatus.BAD_REQUEST).send(errorMessage);
            }

            const resData = await this.lessonPlanService.createLessonPlan(formData);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    update = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Please provide an ID");

            await uploadLessonPlan(req, res);

            const lessonPath = req.file ? req.file.path : null;
            let formData;

            if (lessonPath) formData = { ...req.body, file_path: lessonPath };
            else formData = { ...req.body };

            const { error } = schema.validate(formData, {
                abortEarly: false,
                allowUnknown: true,
                stripUnknown: true,
            });

            if (error) {
                const errorMessage = error.details
                    .map((details) => {
                        return details.message;
                    })
                    .join(', ');
                return res.status(httpStatus.BAD_REQUEST).send(errorMessage);
            }

            const resData = await this.lessonPlanService.updateLessonPlan(
                id,
                formData
            );

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    delete = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Please provide an ID");

            const resData = await this.lessonPlanService.deleteLessonPlan(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    downloadFile = async (req, res) => {
        try {
            const filePath = req.query.file_path;

            // Check if file path is provided
            if (!filePath) {
                return res.status(httpStatus.BAD_REQUEST).send({
                    status: false,
                    code: httpStatus.BAD_REQUEST,
                    message: 'File path not provided.',
                });
            }

            // Resolve the file path to prevent directory traversal
            const safeFilePath = path.resolve(filePath);

            // Check if file exists asynchronously
            await fs.promises.access(safeFilePath, fs.constants.F_OK);

            // Set appropriate headers
            const filename = path.basename(safeFilePath);
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader(
                'Content-Disposition',
                `attachment; filename='${filename}'`
            );

            // Create read stream and pipe to response
            const fileStream = fs.createReadStream(safeFilePath);

            // Handle stream errors
            fileStream.on('error', (error) => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                    status: false,
                    code: httpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message,
                });
            });

            fileStream.pipe(res);
        } catch (e) {
            if (e.code === 'ENOENT') {
                return res.status(httpStatus.NOT_FOUND).send({
                    status: false,
                    code: httpStatus.NOT_FOUND,
                    message: 'File not found.',
                });
            }

            logger.error(e);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                status: false,
                code: httpStatus.INTERNAL_SERVER_ERROR,
                message: e.message,
            });
        }
    };
}

module.exports = LessonPlanController;
