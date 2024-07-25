const httpStatus = require("http-status");
const formExtraService = require("../service/FormExtraService");
const logger = require("../config/logger");

class FormExtraController {
    constructor() {
        this.formExtraService = new formExtraService();
    }

    create = async (req, res) => {
        try {
            const resData = await this.formExtraService.createFormSubject(req.body);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    update = async (req, res) => {
        try {
            var id = req.params.id;
            const resData = await this.formExtraService.updateFormSubject(id, req.body);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    show = async (req, res) => {
        try {
            var id = req.params.id;

            const resData = await this.formExtraService.showFormSubject(id);

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
            const { academic_year, is_active } = req.query
            const offset = limit * page;

            const resData = await this.formExtraService.showPage(
                page,
                limit,
                { search, academic_year, is_active },
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

            const resData = await this.formExtraService.deleteFormSubject(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = FormExtraController;
