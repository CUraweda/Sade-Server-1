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

    showAnnouncementBetween = async (start, end) => {
        const message = 'Announcement successfully retrieved!';

        const cl = await this.announcementDao.getAllBetween(start, end);

        if (!cl) {
            return responseHandler.returnSuccess(httpStatus.OK, 'Announcement not found!', {});
        }

        return responseHandler.returnSuccess(httpStatus.OK, message, cl);
    };

    async showPage(page, limit, search, offset) {
        const totalRows = await this.announcementDao.getCount(search);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.announcementDao.getAnnouncementPage(search, offset, limit);

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
