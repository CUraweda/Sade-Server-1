const httpStatus = require("http-status");
const FormSubjectDao = require("../dao/FormSubjectDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");

class FormSubjectService {
    constructor() {
        this.formSubjectDao = new FormSubjectDao();
    }

    createFormSubject = async (reqBody) => {
        try {
            let message = "Form Subject successfully added.";

            let data = await this.formSubjectDao.create(reqBody);

            if (!data) {
                message = "Failed to create Form Subject.";
                return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
            }

            return responseHandler.returnSuccess(httpStatus.CREATED, message, data);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                "Something went wrong!"
            );
        }
    };

    updateFormSubject = async (id, body) => {
        const message = "Form Subject successfully updated!";

        let rel = await this.formSubjectDao.findById(id);

        if (!rel) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                "Form Subject not found!",
                {}
            );
        }

        const updateData = await this.formSubjectDao.updateWhere(body, { id });

        if (updateData) {
            return responseHandler.returnSuccess(httpStatus.OK, message, {});
        }
    };

    showFormSubject = async (id) => {
        const message = "Form Subject successfully retrieved!";

        let rel = await this.formSubjectDao.getById(id);

        if (!rel) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                "Form Subject not found!",
                {}
            );
        }

        return responseHandler.returnSuccess(httpStatus.OK, message, rel);
    };

    async showPage(page, limit, search, offset, academic_year, is_active) {
        const totalRows = await this.formSubjectDao.getCount(search, academic_year, is_active);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.formSubjectDao.getFormSubjectPage(
            search,
            offset,
            limit,
            academic_year,
            is_active
        );

        return responseHandler.returnSuccess(
            httpStatus.OK,
            "Form Subject successfully retrieved.",
            {
                result: result,
                page: page,
                limit: limit,
                totalRows: totalRows,
                totalPage: totalPage,
            }
        );
    }

    deleteFormSubject = async (id) => {
        const message = "Form Subject successfully deleted!";

        let rel = await this.formSubjectDao.deleteByWhere({ id });

        if (!rel) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                "Form Subject not found!"
            );
        }

        return responseHandler.returnSuccess(httpStatus.OK, message, rel);
    };
}

module.exports = FormSubjectService;
