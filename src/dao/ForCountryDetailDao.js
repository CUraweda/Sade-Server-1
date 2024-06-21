const { Op } = require('sequelize');
const SuperDao = require('./SuperDao');
const models = require('../models');

const ForCountryDetail = models.forcountrydetails;
const ForCountry = models.forcountry;

class ForCountryDetailDao extends SuperDao {
    constructor() {
        super(ForCountryDetail);
    }

    async getByUserId(user_id, academic) {
        return ForCountryDetail.findAll({
            where: {
                '$forcountry.user_id$': user_id,
                '$forcountry.academic_year$': academic,
            },
            include: [
                {
                    model: ForCountry,
                },
            ],
        });
    }

    async getByCountryId(id) {
        return ForCountryDetail.findAll({
            where: {
                for_country_id: id,
            },
        });
    }

    async getCount(search) {
        return ForCountryDetail.count({
            where: {
                [Op.or]: [
                    {
                        activity: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    {
                        duration: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    {
                        remark: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                ],
            },
        });
    }

    async getForCountryDetailPage(search, offset, limit) {
        return ForCountryDetail.findAll({
            where: {
                [Op.or]: [
                    {
                        activity: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    {
                        duration: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    {
                        remark: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                ],
            },
            offset,
            limit,
            order: [['id', 'DESC']],
        });
    }
}
module.exports = ForCountryDetailDao;
