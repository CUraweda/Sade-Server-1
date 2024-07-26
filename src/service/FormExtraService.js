const httpStatus = require("http-status");
const FormExtraDao = require("../dao/FormExtraDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");

class FormExtraService {
    constructor() {
        this.formExtraDao = new FormExtraDao();
    }

    createFormSubject = async (reqBody) => {
        try {
            let message = "Form Subject successfully added.";

            let data = await this.formExtraDao.create(reqBody);

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

        let rel = await this.formExtraDao.findById(id);

        if (!rel) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                "Form Subject not found!",
                {}
            );
        }

        const updateData = await this.formExtraDao.updateWhere(body, { id });

        if (updateData) {
            return responseHandler.returnSuccess(httpStatus.OK, message, {});
        }
    };

    showFormSubject = async (id) => {
        const message = "Form Subject successfully retrieved!";

        let rel = await this.formExtraDao.getById(id);

        if (!rel) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                "Form Subject not found!",
                {}
            );
        }

        return responseHandler.returnSuccess(httpStatus.OK, message, rel);
    };

    async showPage(page, limit, filter, offset) {
        const totalRows = await this.formExtraDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.formExtraDao.getPage(
            filter,
            offset,
            limit
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

    async getAllLevelSubjectFromEmployee(employee_id) {
        const rel = await this.formExtraDao.getByEmployeeId(employee_id)
        if (!rel) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                "Form Subject not found!"
            );
        }
        const level = {}
        rel.forEach((formSubject) => { level[formSubject.subject.level] = 0 })
        return Object.keys(level)
    }

    deleteFormSubject = async (id) => {
        const message = "Form Subject successfully deleted!";

        let rel = await this.formExtraDao.deleteByWhere({ id });

        if (!rel) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                "Form Subject not found!"
            );
        }

        return responseHandler.returnSuccess(httpStatus.OK, message, rel);
    };
}

module.exports = FormExtraService;
