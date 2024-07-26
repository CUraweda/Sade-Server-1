"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class SubjectExtra extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            SubjectExtra.hasMany(models.formextra, { foreignKey: "subject_extra_id" });
        }
    }
    SubjectExtra.init(
        {
            name: DataTypes.STRING
        },
        {
            sequelize,
            tableName: "ref_subject_extra",
            modelName: "subjectextra",
            timestamps: false,
            underscored: true,
        }
    );
    return SubjectExtra;
};
