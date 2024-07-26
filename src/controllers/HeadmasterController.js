const httpStatus = require("http-status");
const HeadmasterService = require("../service/HeadMasterService");
const logger = require("../config/logger");

class HeadmasterController {
    constructor() {
        this.HeadmasterService = new HeadmasterService()
    }

    create = async (req, res) => {
        try {
        const resData = await this.HeadmasterService.createHeadmaster(req.body);

        res.status(resData.statusCode).send(resData.response);
        } catch (e) {
        logger.error(e);
        res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    update = async (req, res) => {
        try {
        var id = req.params.id;
        const resData = await this.HeadmasterService.updateHeadmaster(
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

        const resData = await this.HeadmasterService.showHeadmaster(id);

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
            const start_academic_year = req.query.start_academic_year
            const end_academic_year = req.query.end_academic_year
            const is_active = req.query.is_active
            const offset = limit * page;
    
            const resData = await this.HeadmasterService.showPage(
                page,
                limit,
                search,
                offset,
                start_academic_year,
                end_academic_year,
                is_active
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

        const resData = await this.HeadmasterService.deleteHeadmaster(id);

        res.status(resData.statusCode).send(resData.response);
        } catch (e) {
        logger.error(e);
        res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = HeadmasterController