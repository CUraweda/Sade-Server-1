const httpStatus = require("http-status")
const StudentBillsDao = require("../dao/StudentBillsDao")
const responseHandler = require("../helper/responseHandler")
const logger = require("../config/logger")
const { formatDateForSQL } = require("../helper/utils")
const { Op } = require("sequelize")
const moment = require("moment")

class StudentBillsService {
    constructor() {
        this.studentBillsDao = new StudentBillsDao()
    }

    createStudentBills = async (reqBody) => {
        try {
            let message = "Stuent Bills successfully added"
            let data = await this.studentBillsDao.create(reqBody)

            if (!data) {
                message = "Failed to create student bills"
                return responseHandler.returnError(httpStatus.BAD_REQUEST, message)
            }
            return responseHandler.returnSuccess(httpStatus.CREATED, message, data)
        } catch (e) {
            logger.error(e)
            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                "Something went wrong!"
            )
        }
    }

    bulkCreateStudentBills = async (reqBody) => {
        try {
            let message = "Stuent Bills successfully added"

            const dataList = reqBody.student_ids.map(sid => {
              return {
								student_id: sid,
								payment_bill_id: reqBody.payment_bill_id,
								status: 'Belum Lunas',
							};
            })

            const existingData = await this.studentBillsDao.findAll({
							where: {
									payment_bill_id: reqBody.payment_bill_id,
							},
						});

						const dataToCreate = dataList.filter((dat) => {
							return !existingData.some(
								(eDat) =>
									eDat.payment_bill_id === dat.payment_bill_id && eDat.student_id === dat.student_id
							);
						});

						let data = await this.studentBillsDao.bulkCreate(dataToCreate);

            if (!data) {
                message = "Failed to create student bills"
                return responseHandler.returnError(httpStatus.BAD_REQUEST, message)
            }
            return responseHandler.returnSuccess(httpStatus.CREATED, message, data)
        } catch (e) {
            logger.error(e)
            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                "Something went wrong!"
            )
        }
    }
    showStudentBillsByStudentId = async (id, filters) => {
        const message = "Student Bills successfully retrieved!";
    
        let cl = await this.studentBillsDao.getByStudentId(id, filters);
    
        if (!cl) {
          return responseHandler.returnSuccess(
            httpStatus.OK,
            "Student Bills not found!",
            {}
          );
        }
    
        return responseHandler.returnSuccess(httpStatus.OK, message, cl);
    };
    showStudentBillsById = async (id) => {
      const message = "Student Bills successfully retrieved!";
  
      let rel = await this.studentBillsDao.findById(id);
  
      if (!rel) {
        return responseHandler.returnSuccess(
          httpStatus.OK,
          "Student Bill not found!",
          {}
        );
      }
  
      return responseHandler.returnSuccess(httpStatus.OK, message, rel);
    };
    showDataReport = async (filter) => {  
      let rel = await this.studentBillsDao.getDataReport(filter);
  
      if (!rel) {
        return responseHandler.returnSuccess(
          httpStatus.OK,
          "Student Bill not found!",
          {}
        );
      }
  
      return responseHandler.returnSuccess(httpStatus.OK, "Student Bill Successfully Retrived", rel);
    };
    updateStudentBills = async (id ,body) => {
        const message = "Student Bills successfully updated";

        let rel = await this.studentBillsDao.findById(id)

        if(!rel) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                "Student Bills not found!",
                {}
            )
        }
        const updateData = await this.studentBillsDao.updateById(body, id)
        if (updateData) {
            return responseHandler.returnSuccess(httpStatus.OK, message, {})
        }
    }

    upEvidenceStudentBills = async (ids, body) => {
      if (!body.evidence_path) {
        return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Evidence image not provided', {})
      }

			const updateData = await this.studentBillsDao.updateWhere({ ...body, paidoff_at: formatDateForSQL(new Date(), true) }, { id: {[Op.in]: ids}  });

			if (updateData) {
				return responseHandler.returnSuccess(httpStatus.OK, 'Student evidence successfully uploaded', updateData);
			}
    }

    async showPage(page, limit, search, offset, billId, classId) {
        const totalRows = await this.studentBillsDao.getCount(search, billId, classId);
        const totalPage = Math.ceil(totalRows / limit);
    
        const result = await this.studentBillsDao.getStudentBillsPage(
          search,
          offset,
          limit,
          billId,
          classId
        );
    
        return responseHandler.returnSuccess(
          httpStatus.OK,
          "Student Bills successfully retrieved.",
          {
            result: result,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage,
          }
        );
    }
    deleteStudentBills = async (id) => {
        const message = "Student Bills successfully deleted!";
    
        let rel = await this.studentBillsDao.deleteByWhere({ id });
    
        if (!rel) {
          return responseHandler.returnSuccess(
            httpStatus.OK,
            "Student Bills not found!"
          );
        }
    
        return responseHandler.returnSuccess(httpStatus.OK, message, rel);
    };
    getIncome = async (filters) => {
      const result = await this.studentBillsDao.getIncome(filters)
      return Array.isArray(result) && result.length ? result[0] : result
    }
    getIncomeGroupDate = async (filters) => {
      const result = await this.studentBillsDao.getIncomeGroupByDate(filters)

      let result2 = []
      if (filters.start_date && filters.end_date) {
        const dates = result.map(r => r.dataValues.paidoff_date)
        const values = result.map(r => r.dataValues.sum)

        const startDate = new Date(filters.start_date);
        const endDate = new Date(filters.end_date);
  
        for (
          let date = new Date(startDate);
          date <= endDate;
          date.setDate(date.getDate() + 1)
        ) {
          let formatted = moment(date).format("YYYY-MM-DD")
          let sum = 0
          if (dates.includes(formatted))
            sum = values[dates.indexOf(formatted)]

          result2.push({
            paidoff_date: formatted,
            sum
          })
        }
      }

      return result2.length ? result2 : result
    }
    getRecentPaidOffBills = async (start_date, limit = 5, filters) => {
      return this.studentBillsDao.getRecentPaidOffBills(start_date, limit, filters)
    }
}

module.exports = StudentBillsService