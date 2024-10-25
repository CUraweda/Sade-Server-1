const httpStatus = require('http-status');
const LessonPlanDao = require('../dao/LessonPlanDao');
const responseHandler = require('../helper/responseHandler');

class LessonPlanService {
    constructor() {
        this.lessonPlanDao = new LessonPlanDao();
    }

    showAll = async (page, limit, filter, offset) => {
        const search = filter.search || '';
        const totalRows = await this.lessonPlanDao.getCount(search);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.lessonPlanDao.getLessonPlanPage(
            search,
            offset,
            limit
        );

        return responseHandler.returnSuccess(
            httpStatus.OK,
            'Lesson Plan successfully retrieved.',
            {
                result,
                page,
                limit,
                totalRows,
                totalPage,
            }
        );
    }

    showOne = async (id) => {
        const rel = await this.lessonPlanDao.getById(id);

        if (!rel) {
            return responseHandler.returnError(
                httpStatus.NOT_FOUND,
                'Lesson Plan not found!',
            );
        }
        const message = 'Lesson Plan successfully retrieved!';

        return responseHandler.returnSuccess(httpStatus.OK, message, rel);
    };

    createLessonPlan = async (reqBody) => {
        let message = 'Lesson Plan successfully added.';

        const data = await this.lessonPlanDao.create(reqBody);

        if (!data) {
            message = 'Failed to create Lesson Plan.';
            return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
        }

        return responseHandler.returnSuccess(httpStatus.CREATED, message, data);
    };

    updateLessonPlan = async (id, body) => {
        const { assignments_name, subjects_name, class_id, file_path, description } = body;

        const message = 'Lesson Plan successfully updated!';

        let rel = await this.lessonPlanDao.findById(id);

        if (!rel) {
            return responseHandler.returnError(
                httpStatus.NOT_FOUND,
                'Lesson Plan not found!'
            );
        }

        const updateData = await this.lessonPlanDao.updateWhere(
            {
                assignments_name,
                subjects_name,
                class_id,
                file_path,
                description,
            },
            { id }
        );

        if (updateData) {
            return responseHandler.returnSuccess(httpStatus.OK, message);
        }
    };

    deleteLessonPlan = async (id) => {
        const message = 'Lesson Plan successfully deleted!';

        let rel = await this.lessonPlanDao.deleteByWhere({ id });

        if (!rel) {
            return responseHandler.returnError(
                httpStatus.NOT_FOUND,
                'Lesson Plan not found!'
            );
        }

        return responseHandler.returnSuccess(httpStatus.OK, message);
    };
}

module.exports = LessonPlanService;
