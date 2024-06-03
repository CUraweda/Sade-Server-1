const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const ReportSigner = models.reportsigners;

class ReportSignerDao extends SuperDao {
  constructor() {
    super(ReportSigner);
  }
  getByIdClass(id) {
    return ReportSigner.findOne({
      where: {
        class_id: id,
      },
    });
  }
}
module.exports = ReportSignerDao;
