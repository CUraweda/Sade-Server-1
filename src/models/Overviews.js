const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Overviews extends Model {
        static associate(models) {
            // define association here
        }
    }
    Overviews.init(
        {
            student_id: DataTypes.INTEGER,
            topic: DataTypes.STRING,
            meaningful_understanding: DataTypes.STRING,
            period: DataTypes.STRING,
            tup: DataTypes.TEXT,
            status: DataTypes.STRING,
        },
        {
            sequelize,
            tableName: 'tbl_overviews',
            modelName: 'overviews',
            underscored: true,
        },
    );
    return Overviews;
};
