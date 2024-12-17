const httpStatus = require("http-status");
const EmployeeSignatureDao = require("../dao/EmployeeSignatureDao");
const responseHandler = require("../helper/responseHandler");

class EmployeeSignatureService {
    constructor() {
        this.employeeSignatureDao = new EmployeeSignatureDao();
    }

    create = async (body) => {
        const employeeSignatureData = await this.employeeSignatureDao.create(body);
        if (!employeeSignatureData)
            return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create employee signature record");
        
        return responseHandler.returnSuccess(httpStatus.CREATED, "Employee signature record created successfully", employeeSignatureData);
    };
    
    createMine = async (employee, body) => {
        if (!employee) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Anda tidak termasuk employee");
        body['employee_id'] = employee.id
        const alreadyExist = await this.employeeSignatureDao.checkDataForAdd(body)
        if (alreadyExist.length > 0) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data kelas/level sudah ada yang pernah dibuat/diambil, mohon konfirmasi kembali");
        
        const employeeSignatureData = await this.employeeSignatureDao.updateOrCreate(body, { employee_id: employee.id });
        if (!employeeSignatureData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to update employee signature record");
        
        return responseHandler.returnSuccess(httpStatus.CREATED, "Employee signature record added successfully", employeeSignatureData);
    }

    update = async (id, body) => {
        const dataExist = await this.employeeSignatureDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee signature record not found");
        const employeeSignatureData = await this.employeeSignatureDao.updateWhere(body, { id });
        if (!employeeSignatureData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to update employee signature record");


        return responseHandler.returnSuccess(httpStatus.OK, "Employee signature record updated successfully", {});
    };

    delete = async (id) => {
        const employeeSignatureData = await this.employeeSignatureDao.deleteByWhere({ id });
        if (!employeeSignatureData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to delete employee signature record");

        return responseHandler.returnSuccess(httpStatus.OK, "Employee signature record deleted successfully", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.employeeSignatureDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.employeeSignatureDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Employee signature records retrieved successfully", {
            result,
            page,
            limit,
            totalRows,
            totalPage,
        });
    };

    showOne = async (id) => {
        const employeeSignatureData = await this.employeeSignatureDao.findById(id);
        if (!employeeSignatureData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee signature record not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Employee signature record found", employeeSignatureData);
    };
}

module.exports = EmployeeSignatureService;
