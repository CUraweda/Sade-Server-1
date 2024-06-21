const httpStatus = require('http-status');
const fs = require('fs');
const ForCountryDetailDao = require('../dao/ForCountryDetailDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');
const { userConstant } = require('../config/constant');

class ForCountryDetailService {
    constructor() {
        this.forCountryDetailDao = new ForCountryDetailDao();
    }

    createForCountryDetail = async (reqBody) => {
        try {
            let message = 'For your country details successfully added.';

            const data = await this.forCountryDetailDao.create(reqBody);

            if (!data) {
                message = 'Failed to create for your country details.';
                return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
            }

            return responseHandler.returnSuccess(httpStatus.CREATED, message, data);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    };

    updateForCountryDetail = async (id, body) => {
        const message = 'For your country details successfully updated!';

        const rel = await this.forCountryDetailDao.findById(id);

        if (!rel) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                'For your country details not found!',
                {},
            );
        }

        const updateData = await this.forCountryDetailDao.updateById(body, id);

        // delete file if exist
        const rData = rel.dataValues;

        if (rData.certificate_path) {
            // console.log(rData.cover);
            if (body.certificate_path) {
                fs.unlink(rData.certificate_path, (err) => {
                    if (err) {
                        return responseHandler.returnError(
                            httpStatus.NOT_FOUND,
                            'Cannot delete attachment!',
                        );
                    }
                    console.log('Delete File successfully.');
                });
            }
        }

        if (updateData) {
            return responseHandler.returnSuccess(httpStatus.OK, message, {});
        }
    };

    showForCountryDetail = async (id) => {
        const message = 'For your country details successfully retrieved!';

        const rel = await this.forCountryDetailDao.findById(id);

        if (!rel) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                'For your country details not found!',
                {},
            );
        }

        return responseHandler.returnSuccess(httpStatus.OK, message, rel);
    };

    showForCountryDetailByUserId = async (id, academic) => {
        const message = 'For your country details successfully retrieved!';

        const rel = await this.forCountryDetailDao.getByUserId(id, academic);

        if (!rel) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                'For your country details not found!',
                {},
            );
        }

        return responseHandler.returnSuccess(httpStatus.OK, message, rel);
    };

    showForCountryDetailByCountryId = async (id) => {
        const message = 'For your country details successfully retrieved!';

        const rel = await this.forCountryDetailDao.getByCountryId(id);

        if (!rel) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                'For your country details not found!',
                {},
            );
        }

        return responseHandler.returnSuccess(httpStatus.OK, message, rel);
    };

    async showPage(page, limit, search, offset) {
        const totalRows = await this.forCountryDetailDao.getCount(search);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.forCountryDetailDao.getForCountryDetailPage(
            search,
            offset,
            limit,
        );

        return responseHandler.returnSuccess(
            httpStatus.OK,
            'For your country details successfully retrieved.',
            {
                result,
                page,
                limit,
                totalRows,
                totalPage,
            },
        );
    }

    deleteForCountryDetail = async (id) => {
        const message = 'For your country details successfully deleted!';

        const rel = await this.forCountryDetailDao.deleteByWhere({ id });

        if (!rel) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                'For your country details not found!',
            );
        }

        return responseHandler.returnSuccess(httpStatus.OK, message, rel);
    };
}

module.exports = ForCountryDetailService;
