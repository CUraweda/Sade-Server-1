const httpStatus = require("http-status");
const TaskDao = require("../dao/TaskDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const fs = require("fs");
const HeadmasterDao = require("../dao/HeadmasterDao");
const { truncate } = require("fs-extra");

class HeadmasterService {
    constructor(){
        this.headmasterDao = new HeadmasterDao()
    }

    createHeadmaster = async (reqBody) => {
        try {
            let message = "Headmaster successfully added.";

            if (reqBody.is_active === true) {
                await this.headmasterDao.updateWhere(
                    { is_active: 0 },
                    { is_active: 1, category: reqBody.category}
                );
            }

            let data = await this.headmasterDao.create(reqBody);

            if (!data) {
                message = "Failed to create headmaster.";
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
    }
    updateHeadmaster = async (id, body) => {
        const message = "Headmaster successully updated!"

        if (body.is_active === true) {
            await this.headmasterDao.updateWhere(
                { is_active: 0 },
                { is_active: 1, category: reqBody.category}
            );
        }

        let rel = await this.headmasterDao.findById(id)

        if (!rel) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                "Headmaster not found!",
                {}
            )
        }

        const updateData = await this.headmasterDao.updateById(body, id)

        if (updateData) {
            return responseHandler.returnSuccess(httpStatus.OK, message, {});
        }
    }

    showHeadmaster = async (id) => {
        const message = "Headmaster successfully retrieved!"

        let rel = await this.headmasterDao.getById(id)

        if (!rel || rel.length === 0) {
            return responseHandler.returnSuccess(
              httpStatus.OK,
              "Headmaster not found!",
              {}
            );
          }
      
        return responseHandler.returnSuccess(httpStatus.OK, message, rel);
    };

    async showPage(page, limit, search, offset, start_academic_year, end_academic_year, is_active) {
        const totalRows = await this.headmasterDao.getCount(search, start_academic_year, end_academic_year, is_active);
        const totalPage = Math.ceil(totalRows / limit);
        
        const result = await this.headmasterDao.getHeadmasterPage(
            search,
            offset,
            limit,
            start_academic_year,
            end_academic_year,
            is_active
        );
    
        return responseHandler.returnSuccess(
            httpStatus.OK,
            "Headmaster successfully retrieved.",
            {
                result: result,
                page: page,
                limit: limit,
                totalRows: totalRows,
                totalPage: totalPage,
            }
        );
    }
    
    deleteHeadmaster = async (id) => {
        const message = "Headmaster successfully deleted!"

        let rel = await this.headmasterDao.deleteByWhere({id})

        if (!rel) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                "Headmaster not found!"
            );
        }

        return responseHandler.returnSuccess(httpStatus.OK, message, rel);
    };
}

module.exports = HeadmasterService