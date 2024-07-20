const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Overview = models.overviews;

class OverviewDao extends SuperDao {
  constructor() {
    super(Overview);
  }

  async getActive(classId) {
    return Overview.findOne({
      where: {
        status: "Aktif",
        class_id: classId ?? undefined
      },
    });
  }

  async setActive(id) {
    try {
      const thisOverview = await this.findById(id)
      // Set all records to "Non Aktif" except the one with the given id
      await Overview.update(
        { status: "Non Aktif" },
        {
          where: {
            id: { [Op.not]: id },
            class_id: classId ?? undefined
          },
        }
      );

      // Set the specified record to "Aktif"
      await Overview.update(
        { status: "Aktif" },
        {
          where: { id },
        }
      );

      return "Success"; // Return something meaningful if needed
    } catch (error) {
      console.error("Error setting active status:", error);
      throw error;
    }
  }

  async getCount(search) {
    return Overview.count({
      where: {
        [Op.or]: [
          {
            topic: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            meaningful_understanding: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            period: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            tup: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            status: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
  }

  async getOverviewPage(search, offset, limit) {
    return Overview.findAll({
      where: {
        [Op.or]: [
          {
            topic: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            meaningful_understanding: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            period: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            tup: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            status: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = OverviewDao;
