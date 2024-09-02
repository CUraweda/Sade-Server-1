const httpStatus = require("http-status");
const LessonPlanDao = require("../dao/LessonPlanDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");

class LessonPlanService {
    constructor() {
        this.lessonPlanDao = new LessonPlanDao();
    }

    createLessonPlan = async (reqBody) => {
        try {
            let message = "Lesson Plan successfully added.";

            let data = await this.lessonPlanDao.create(reqBody);

            if (!data) {
                message = "Failed to create Lesson Plan.";
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

    updateLessonPlan = async (id, body) => {
        const message = "Lesson Plan successfully updated!";

        let rel = await this.lessonPlanDao.findById(id);

        if (!rel) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                "Lesson Plan not found!",
                {}
            );
        }

        const updateData = await this.lessonPlanDao.updateWhere(
            {
                assignments_name: body.assignments_name,
                subjects_name: body.subjects_name,
                class: body.class,
                file_path: body.file_path,
                description: body.description,
            },
            { id }
        );

        if (updateData) {
            return responseHandler.returnSuccess(httpStatus.OK, message, {});
        }
    };

    showLessonPlan = async (id) => {
        const message = "Lesson Plan successfully retrieved!";

        let rel = await this.lessonPlanDao.findById(id);

        if (!rel) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                "Lesson Plan not found!",
                {}
            );
        }

        return responseHandler.returnSuccess(httpStatus.OK, message, rel);
    };

    showPage = async (page, limit, filter, offset) => {
        const totalRows = await this.lessonPlanDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.lessonPlanDao.getLessonPlanPage(
            filter,
            offset,
            limit,
        );

        return responseHandler.returnSuccess(
            httpStatus.OK,
            "Lesson Plan successfully retrieved.",
            {
                result,
                page,
                limit,
                totalRows,
                totalPage,
            }
        );
    }

    deleteLessonPlan = async (id) => {
        const message = "Lesson Plan successfully deleted!";

        let rel = await this.lessonPlanDao.deleteByWhere({ id });

        if (!rel) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                "Lesson Plan not found!"
            );
        }

        return responseHandler.returnSuccess(httpStatus.OK, message, rel);
    };
}

module.exports = LessonPlanService;
