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
  
    const results = await WasteCollection.findAll({
      where: whereClause,
      include: [
        {
          model: WasteTypes,
          as: 'wastetype',
          attributes: ["id", "name", "price"]
        }
      ],
      attributes: [
        [models.sequelize.fn('SUM', models.sequelize.col('weight')), 'totalWeight'], 'collection_date'
      ],
      group: ['wastetype.id', 'wastetype.name', 'wastetype.price']
    });
  
    return results.map(result => {
      const totalWeightGrams = result.get('totalWeight');
      const totalWeightKg = totalWeightGrams / 1000; 
      const roundedTotalWeight = Math.round(totalWeightKg * 100) / 100;
  
      if (result.wastetype && result.wastetype.price !== null) {
        const totalPricePerKg = result.wastetype.price;
        let totalPrice = totalPricePerKg * totalWeightKg;
        totalPrice = Math.round(totalPrice * 100) / 100;
  
        return {
          id: result.wastetype.id,
          name: result.wastetype.name,
          price: result.wastetype.price,
          total_weight: roundedTotalWeight,
          total_price: totalPrice,
          collection_date: result.collection_date
        };
      } else {
        console.warn(`Missing price for wastetype with ID: ${result.wastetype ? result.wastetype.id : 'unknown'}`);
        return {
          id: result.wastetype ? result.wastetype.id : null,
          name: result.wastetype ? result.wastetype.name : null,
          price: null,
          total_weight: roundedTotalWeight,
          total_price: null,
          collection_date: result.collection_date
        };
      }
    });
  }
  
  async getDetailChart(wastetypeId, startDate, endDate) {
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
  
    const results = await WasteCollection.findAll({
      where: whereClause,
      include: [
        {
          model: WasteTypes,
          as: 'wastetype',
          attributes: ["id", "name", "price"]
        }
      ],
      attributes: [
        [models.sequelize.fn('SUM', models.sequelize.col('weight')), 'totalWeight'],
        'collection_date' // Include the collection_date
      ],
      group: ['wastetype.id', 'wastetype.name', 'wastetype.price', 'collection_date'],
      order: [['collection_date', 'ASC']] // Add order clause here
    });
  
    return results.map(result => {
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
        total_price: totalPrice,
        collection_date: result.collection_date
      };
    });
  }

  async getChartData(startDate, endDate, wasteTypeId = null) {
    const whereClause = {
      collection_date: {
        [Op.between]: [
          new Date(`${startDate} 00:00:00`),
          new Date(`${endDate} 23:59:59`)
        ]
      }
    };

    if (wasteTypeId) {
      whereClause.waste_type_id = wasteTypeId;
    }

    const results = await WasteCollection.findAll({
      where: whereClause,
      include: [
        {
          model: WasteTypes,
          as: 'wastetype',
          attributes: [] // No need to include individual attributes
        }
      ],
      attributes: [
        [models.sequelize.fn('DATE', models.sequelize.col('collection_date')), 'date'],
        [models.sequelize.fn('SUM', models.sequelize.col('weight')), 'totalWeight'],
        [models.sequelize.literal('SUM((weight / 1000) * wastetype.price)'), 'totalPrice']
      ],
      group: [models.sequelize.fn('DATE', models.sequelize.col('collection_date'))],
      order: [[models.sequelize.fn('DATE', models.sequelize.col('collection_date')), 'ASC']]
    });

    return results.map(result => ({
      date: result.get('date'),
      total_weight: result.get('totalWeight'),
      total_price: result.get('totalPrice')
    }));
  }  
}  

module.exports = WasteSalesDao;
