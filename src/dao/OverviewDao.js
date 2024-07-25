const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Overview = models.overviews;
const Classes = models.classes

class OverviewDao extends SuperDao {
  constructor() {
    super(Overview);
  }

  async getActive(classId) {
    let result = await Overview.findOne({
      where: {
        status: "Aktif",
        class_id: classId
      },
      include: [
        {
          model: Classes,
          attributes: ["id", "level", "class_name"]
        }
      ],
    });
    
    if (!result) {
      result = await Overview.findOne({
        where: {
          status: "Aktif"
        },
        include: [
          {
            model: Classes,
            attributes: ["id", "level", "class_name"]
          }
        ],
      });
    }
  
    return result;
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
            class_id: thisOverview.class_id
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

  async getCount(search, filters) {
    const where = {
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
    }
    
    if (filters.class_ids?.length) where["class_id"] = { [Op.in]: filters.class_ids }

    if (filters.class_id) where["class_id"] = filters.class_id

    return Overview.count({
      where
    });
  }

  async getOverviewPage(search, offset, limit, filters) {
    const where = {
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
    }

    if (filters.class_ids?.length) where["class_id"] = { [Op.in]: filters.class_ids }

    if (filters.class_id) where["class_id"] = filters.class_id

    return Overview.findAll({
      where,
      include: [
        {
          model: Classes,
          attributes: ["id", "level", "class_name"]
        }
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = OverviewDao;
