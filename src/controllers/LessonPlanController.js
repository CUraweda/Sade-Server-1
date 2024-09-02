const httpStatus = require("http-status");
const LessonPlanService = require("../service/LessonPlanService");
const logger = require("../config/logger");

class LessonPlanController {
    constructor() {
        this.lessonPlanService = new LessonPlanService();
    }

    create = async (req, res) => {
        try {
            const resData = await this.lessonPlanService.createLessonPlan(req.body);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    update = async (req, res) => {
        try {
            var id = req.params.id;

            const resData = await this.lessonPlanService.updateLessonPlan(
                id,
                req.body
            );

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    show = async (req, res) => {
        try {
            var id = req.params.id;

            const resData = await this.lessonPlanService.showLessonPlan(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    showAll = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 0;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search_query || "";
            const offset = limit * page;

            const resData = await this.lessonPlanService.showPage(
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

    delete = async (req, res) => {
        try {
            var id = req.params.id;

            const resData = await this.lessonPlanService.deleteLessonPlan(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = LessonPlanController;
