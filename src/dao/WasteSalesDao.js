const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const WasteCollection = models.wastecollection;
const WasteTypes = models.wastetypes;

class WasteSalesDao extends SuperDao {
  async countWasteSummary(wastetypeId, startDate, endDate) {
    const whereClause = {};

    if (startDate && endDate) {
      whereClause.collection_date = {
        [Op.between]: [
          new Date(startDate + ' 00:00:00'),
          new Date(endDate + ' 23:59:59')
        ]
      };
    } else if (startDate) {
      whereClause.collection_date = {
        [Op.gte]: new Date(startDate + ' 00:00:00')
      };
    } else if (endDate) {
      whereClause.collection_date = {
        [Op.lte]: new Date(endDate + ' 23:59:59')
      };
    }

    if (wastetypeId) {
      whereClause.waste_type_id = wastetypeId;
    }

    return WasteCollection.count({
      where: whereClause,
      include: [
        {
          model: WasteTypes,
          as: 'wastetype',
          attributes: ["id", "name", "price"]
        }
      ],
    });
  }

  async getWasteSummary(wastetypeId, startDate, endDate, offset, limit) {
    const whereClause = {};
  
    if (startDate && endDate) {
      whereClause.collection_date = {
        [Op.between]: [
          new Date(startDate + ' 00:00:00'),
          new Date(endDate + ' 23:59:59')
        ]
      };
    } else if (startDate) {
      whereClause.collection_date = {
        [Op.gte]: new Date(startDate + ' 00:00:00')
      };
    } else if (endDate) {
      whereClause.collection_date = {
        [Op.lte]: new Date(endDate + ' 23:59:59')
      };
    }
  
    if (wastetypeId) {
      whereClause.waste_type_id = wastetypeId;
    }
  
    return WasteCollection.findAll({
      where: whereClause,
      include: [
        {
          model: WasteTypes,
          as: 'wastetype',
          attributes: ["id", "name", "price"]
        }
      ],
      attributes: [
        [models.sequelize.fn('SUM', models.sequelize.col('weight')), 'totalWeight']
      ],
      group: ['wastetype.id', 'wastetype.name', 'wastetype.price']
    }).then(results => results.map(result => {
      const totalWeightGrams = result.get('totalWeight');
      const totalWeightKg = totalWeightGrams / 1000; 
      const totalPricePerKg = result.wastetype.price;
      const roundedTotalWeight = Math.round(totalWeightKg * 100) / 100;
  
      let totalPrice = totalPricePerKg * totalWeightKg;
  
      totalPrice = Math.round(totalPrice * 100) / 100;
      return {
        id: result.wastetype.id,
        name: result.wastetype.name,
        price: result.wastetype.price,
        total_weight: roundedTotalWeight,
        total_price: totalPrice
      };
    }));
  }
  
}  

module.exports = WasteSalesDao;