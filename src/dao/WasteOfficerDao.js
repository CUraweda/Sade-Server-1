const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const WasteOfficer = models.wasteofficer;
const Employee = models.employees;
const Class = models.classes;

class WasteOfficerDao extends SuperDao {
  constructor() {
    super(WasteOfficer);
  }

  async getCount(search) {
    return WasteOfficer.count({
      where: {
        [Op.or]: [
        //   {
        //     "$class.class_name$": {
        //       [Op.like]: "%" + search + "%",
        //     },
        //   },
        //   {
        //     "$employee.full_name$": {
        //       [Op.like]: "%" + search + "%",
        //     },
        //   },
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            class_name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            assignment_date: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
        // include: [
        //     {
        //         model: Employee,
        //         as: 'employee',
        //         attributes: ["id", "full_name"]
        //     },
        //     {
        //         model: Class,
        //         as: 'class',
        //         attributes: ["id","level", "class_name"]
        //     }
        // ]
      },
    });
}

  async getWasteOfficerPage(search, offset, limit) {
    return WasteOfficer.findAll({
        where: {
          [Op.or]: [
            // {
            //   "$class.class_name$": {
            //     [Op.like]: "%" + search + "%",
            //   },
            // },
            // {
            //   "$employee.full_name$": {
            //     [Op.like]: "%" + search + "%",
            //   },
            // },
            {
              name: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              class_name: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              assignment_date: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        //   include: [
        //       {
        //           model: Employee,
        //           as: 'employee',
        //           attributes: ["id", "full_name"]
        //       },
        //       {
        //           model: Class,
        //           as: 'class',
        //           attributes: ["id","level", "class_name"]
        //       }
        //   ]
        },
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = WasteOfficerDao;
