const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Subject = models.subjects;
const FormSubject = models.formsubject
class SubjectDao extends SuperDao {
  constructor() {
    super(Subject);
  }

  async getAll(level) {
    return Subject.findAll({
      where: {
        [Op.or]: [
          {
            level: {
              [Op.like]: `%${level}%`
            }
          }
        ]
      },
      order: [["id", "asc"]]
    })
  }

  async getCount(filter) {
    const { search, subjectIds } = filter

    return Subject.count({
    where: {
      [Op.and]: [
        (subjectIds?.length && {
          [Op.or]: [
            ((subjectIds && subjectIds.length > 0) && { id: { [Op.in]: subjectIds} }),
          ]
        }),
        {
          [Op.or]: [
            {
              level: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              code: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              name: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        }
      ],
      },
    });
  }

  async getSubjectPage(filter, offset, limit) {
    const { search, subjectIds } = filter
    return Subject.findAll({
      where: {
        [Op.and]: [
          (subjectIds?.length && {
            [Op.or]: [
              ((subjectIds && subjectIds.length > 0) && { id: { [Op.in]: subjectIds} }),
            ]
          }),
          {
            [Op.or]: [
              {
                level: {
                  [Op.like]: "%" + search + "%",
                },
              },
              {
                code: {
                  [Op.like]: "%" + search + "%",
                },
              },
              {
                name: {
                  [Op.like]: "%" + search + "%",
                },
              },
            ],
          }
        ],
      },
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = SubjectDao;
