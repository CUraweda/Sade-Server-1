const httpStatus = require("http-status");
const SuperDao = require("../dao/SuperDao");
const models = require("../models");

const UserAccess = models.useraccess;

/**
 * @param {'body' | 'query' | 'params'} source
 * @param {string} source_key ex: student_id, studentId, etc
 * **/
const isStudentParentValid = (source, source_key) => {
  return async (req, res, next) => {
    const dao = new SuperDao(UserAccess);
    const studentId = req[source][source_key];

    const check = await dao.getCountByWhere({
      user_id: req.user.id,
      student_id: studentId,
    });

    if (!check)
      return res.status(httpStatus.FORBIDDEN).json({
        status: false,
        code: httpStatus.FORBIDDEN,
        message: "Akses ke data siswa lain diblokir",
      });

    next();
  };
};

module.exports = isStudentParentValid;
