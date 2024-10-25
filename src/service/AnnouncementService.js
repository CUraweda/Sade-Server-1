const httpStatus = require('http-status');
const AnnouncementDao = require('../dao/AnnoucementDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');
const { userConstant } = require('../config/constant');

class AnnouncementService {
    constructor() {
        this.announcementDao = new AnnouncementDao();
    }  

    createAnnouncement = async (reqBody) => {
        try {
            let message = 'Announcement successfully added.';

            const data = await this.announcementDao.create(reqBody);

            if (!data) {
                message = 'Failed to create announcement.';
                return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
            }

            return responseHandler.returnSuccess(httpStatus.CREATED, message, data);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    };

    updateAnnouncement = async (id, body) => {
        const message = 'Announcement successfully updated!';

        const cl = await this.announcementDao.findById(id);

        if (!cl) {
            return responseHandler.returnSuccess(httpStatus.OK, 'Announcement not found!', {});
        }

    const updateData = await this.announcementDao.updateWhere(
      {
        date_start: body.date_start,
        date_end: body.date_end,
        announcement_desc: body.announcement_desc,
        class_id: body.class_id,
        file_path: body.file_path ?? null,
        file_type: body.file_type ?? null,
        class_ids: body.class_ids
      },
      { id }
    );

        if (updateData) {
            return responseHandler.returnSuccess(httpStatus.OK, message, {});
        }
    };

    showByClass = async (id) => {
        const message = 'Announcement successfully retrieved!';

        const cl = await this.announcementDao.findByClass(id);

        if (!cl) {
            return responseHandler.returnSuccess(httpStatus.OK, 'Announcement not found!', {});
        }

        return responseHandler.returnSuccess(httpStatus.OK, message, cl);
    };

    showAnnouncement = async (id) => {
        const message = 'Announcement successfully retrieved!';

        const cl = await this.announcementDao.findById(id);

        if (!cl) {
            return responseHandler.returnSuccess(httpStatus.OK, 'Announcement not found!', {});
        }

        return responseHandler.returnSuccess(httpStatus.OK, message, cl);
    };

    showAnnouncementBetween = async (start, end, classId) => {
        const message = 'Announcement successfully retrieved!';

        const cl = await this.announcementDao.getAllBetween(start, end, classId);

        if (!cl) {
            return responseHandler.returnSuccess(httpStatus.OK, 'Announcement not found!', {});
        }

        return responseHandler.returnSuccess(httpStatus.OK, message, cl);
    };

    async showPage(page, limit, search, offset, filters) {
        const totalRows = await this.announcementDao.getCount(search, filters);
        const totalPage = Math.ceil(totalRows / limit);

        console.log("AMAN 3", totalRows)    
        const result = await this.announcementDao.getAnnouncementPage(search, offset, limit, filters);
        console.log("AMAN 5", result)    

        return responseHandler.returnSuccess(
            httpStatus.OK,
            'Announcement successfully retrieved.',
            {
                result,
                page,
                limit,
                totalRows,
                totalPage,
            },
        );
    }

    deleteAnnouncement = async (id) => {
        const message = 'Announcement successfully deleted!';

        const cl = await this.announcementDao.deleteByWhere({ id });

        if (!cl) {
            return responseHandler.returnSuccess(httpStatus.OK, 'Announcement not found!');
        }

        return responseHandler.returnSuccess(httpStatus.OK, message, cl);
    };
}

module.exports = AnnouncementService;
