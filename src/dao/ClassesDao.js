const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");
const { level } = require("winston");

const Classes = models.classes;
const FormTeacher = models.formteacher
class ClassesDao extends SuperDao {
  constructor() {
    super(Classes);
  }

  async getCount(filter) {
    const { search, levels, classIds } = filter
    return Classes.count({
      where: {
        [Op.and]: [
          ((levels?.length || classIds?.length) && {
            [Op.or]: [
              ((levels && levels.length > 0) && { level: { [Op.in]: levels} }),
              ((classIds && classIds.length > 0) && { id: { [Op.in]: classIds} }),
            ]
          }),
          { 
            [Op.or]: [
              {
                class_name: {
                  [Op.like]: "%" + search + "%",
                },
              }
            ]
          },
        ],
      },
    });
  }

  async getClassesByLevels(levels = []) {
    return Classes.findAll({
      where: {
        [Op.in]: levels
      }
    })
  }

  async getClassesPage(filter, offset, limit) {
    const { search, levels, classIds } = filter
    return Classes.findAll({
      where: {
        [Op.and]: [
          ((levels?.length || classIds?.length) && {
            [Op.or]: [
              ((levels && levels.length > 0) && { level: { [Op.in]: levels} }),
              ((classIds && classIds.length > 0) && { id: { [Op.in]: classIds} }),
            ]
          }),
          { 
            [Op.or]: [
              {
                class_name: {
                  [Op.like]: "%" + search + "%",
                },
              }
            ]
          },
        ],
      },
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = ClassesDao;
