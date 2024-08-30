const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");
const { level } = require("winston");

const Classes = models.classes;
const FormTeacher = models.formteacher
const FormSubject = models.formsubject
const Subject = models.subjects
const Employee = models.employees

class ClassesDao extends SuperDao {
  constructor() {
    super(Classes);
  }

  async getCount(filter) {
    const { search, employee_id, is_active } = filter
    let levels = [], classIds = []

    if (employee_id) {
      const subjects = await Subject.findAll({
        attributes: ["level"],
        include: [
          {
            model: FormSubject,
            attributes: [],
            where: {
              employee_id: employee_id,
              is_active: true
            },
            required: true
          }
        ]
      })
  
      if (subjects.length) levels = subjects.map(s => s.level)

      const formClasses = await Classes.findAll({
        attributes: ["id"],
        include: [
          {
            model: FormTeacher,
            attributes: [],
            where: {
              employee_id: employee_id,
              is_active: true
            },
            required: true
          },
        ]
      })

      if (formClasses) classIds = formClasses.map(fc => fc.id)
    }
  return Classes.count({
    where: {         
        ...(is_active == "Y" && { is_active: true }),
        [Op.and]: [
          (employee_id && {
            [Op.or]: {
              id: { [Op.in]: classIds }, 
              level: { [Op.in]: levels }, 
            }
          }),
          {
            [Op.or]: {
              class_name: {
                [Op.like]: "%" + search + "%",
              },
            }
          }
        ]
      },
      order: [["id", "DESC"]],
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
    const { search, employee_id, with_subject = "Y", with_form_class = "Y", is_active } = filter
    let levels = [], classIds = []

    if (employee_id) {
      if (with_subject == "Y") {
        const subjects = await Subject.findAll({
          attributes: ["level"],
          include: [
            {
              model: FormSubject,
              attributes: [],
              where: {
                employee_id: employee_id,
                is_active: true
              },
              required: true
            }
          ]
        })

        if (subjects.length) levels = subjects.map(s => s.level)
      }
  
      if (with_form_class == "Y") {
        const formClasses = await Classes.findAll({
          attributes: ["id"],
          include: [
            {
              model: FormTeacher,
              attributes: [],
              where: {
                employee_id: employee_id,
                is_active: true
              },
              required: true
            },
          ]
        })
  
        if (formClasses) classIds = formClasses.map(fc => fc.id)
      }
    }

    return Classes.findAll({
      where: {
        ...(is_active == "Y" && { is_active: true }),
        [Op.and]: [
          (employee_id && {
            [Op.or]: {
              id: { [Op.in]: classIds }, 
              level: { [Op.in]: levels }, 
            }
          }),
          {
            [Op.or]: {
              class_name: {
                [Op.like]: "%" + search + "%",
              },
            }
          }
        ]
      },
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = ClassesDao;
