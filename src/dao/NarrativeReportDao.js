const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op, where } = require("sequelize");
const { level } = require("winston");

const NarrativeReport = models.narrativereport;
const Students = models.students;
const StudentClass = models.studentclass;
const Classes = models.classes;
const NarrativeCategory = models.narrativecategory;
const NarrativeSubCategory = models.narrativesubcategory;
const NarrativeDesc = models.narrativedesc;
const NarrativeComment = models.narrativecomment;
const StudentReports = models.studentreports;
const ReportSigners = models.reportsigners;
const EmployeeSignature = models.employeesignature;

class NarrativeReportDao extends SuperDao {
  constructor() {
    super(NarrativeReport);
  }

  async getById(id) {
    return NarrativeReport.findAll({
      where: { id },
      include: [
        {
          model: StudentReports,
          include: [
            {
              model: StudentClass,
              attributes: ["id", "academic_year", "student_id", "class_id"],
              include: [
                {
                  model: Students,
                  attributes: ["id", "nis", "nisn", "full_name", "gender"],
                },
                {
                  model: Classes,
                  attributes: ["id", "class_name"],
                },
              ],
            },
          ],
        },
        {
          model: NarrativeDesc,
          include: [
            {
              model: NarrativeSubCategory,
              include: [{ model: NarrativeCategory }],
            },
          ],
        },
      ],
    });
  }

  async getCount(search) {
    return NarrativeReport.count({
      where: {
        [Op.or]: [
          {
            "$studentreport.studentclass.student.nis$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$studentreport.studentclass.student.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$studentreport.studentclass.academic_year$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$studentreport.semester$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$narrativedesc.desc$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            grade: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: StudentReports,
          include: [
            {
              model: StudentClass,
              attributes: ["id", "academic_year", "student_id", "class_id"],
              include: [
                {
                  model: Students,
                  attributes: ["id", "nis", "nisn", "full_name", "gender"],
                },
                {
                  model: Classes,
                  attributes: ["id", "class_name"],
                },
              ],
            },
          ],
        },
        {
          model: NarrativeDesc,
          include: [
            {
              model: NarrativeSubCategory,
              attributes: ["id", "narrative_cat_id", "code", "sub_category"],
              include: [
                {
                  model: NarrativeCategory,
                  attributes: ["id", "category"],
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async getNarrativeReportPage(search, offset, limit) {
    return NarrativeReport.findAll({
      where: {
        [Op.or]: [
          {
            "$studentreport.studentclass.student.nis$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$studentreport.studentclass.student.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$studentreport.studentclass.academic_year$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$studentreport.semester$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$narrativedesc.desc$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            grade: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: StudentReports,
          include: [
            {
              model: StudentClass,
              attributes: ["id", "academic_year", "student_id", "class_id"],
              include: [
                {
                  model: Students,
                  attributes: ["id", "nis", "nisn", "full_name", "gender"],
                },
                {
                  model: Classes,
                  attributes: ["id", "class_name"],
                },
              ],
            },
          ],
        },
        {
          model: NarrativeDesc,
          include: [
            {
              model: NarrativeSubCategory,
              attributes: ["id", "narrative_cat_id", "code", "sub_category"],
              include: [
                {
                  model: NarrativeCategory,
                  attributes: ["id", "category"],
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async getByStudentId(id, semester, academic = '2025/2026') {
    const sClass = await StudentClass.findOne({
      where: {
        id: id,
        academic_year: academic
        //  is_active: "Ya" 
      },
      include: [
        {
          model: Students,
          attributes: ["id", "nis", "nisn", "full_name", "gender"],
        },
        {
          model: Classes,
          attributes: ["id", "level", "class_name"],
        },
      ],
    });

    if (!sClass) {
      throw new Error("Student class not found");
    }
    const sClassId = sClass.id || 0;

    const sReportData = await StudentReports.findOne({
      where: { student_class_id: sClassId, semester },
    });

    const { nar_teacher_comments, nar_parent_comments } = sReportData || {};

    const levParams = sClass.class_id || 0;
    const level = sClass.class?.level || "";

    const nCategories = await NarrativeCategory.findAll({
      where: { class_id: levParams },
      attributes: ["id", "category"],
    });

    const nSubCategory = await NarrativeSubCategory.findAll();

    const nReports = await NarrativeReport.findAll({
      where: {
        "$studentreport.student_class_id$": sClassId,
        "$studentreport.semester$": semester,
      },
      include: [{ model: StudentReports }, { model: NarrativeDesc }],
    });

    const sRepId = nReports.length > 0 ? nReports[0].student_report_id : 0;

    const nComments = sRepId
      ? await NarrativeComment.findAll({
        where: {
          "$studentreport.id$": sRepId,
        },
        include: [
          {
            model: StudentReports,
            include: [
              {
                model: StudentClass,
                attributes: ["id", "academic_year", "student_id", "class_id"],
              },
            ],
          },
        ],
      })
      : [];

    // const {
    //   academic_year,
    //   student_id,
    //   class: { class_name = "" } = {},
    //   student: { full_name = "", nisn = "", nis = "" } = {},
    // } = sClass ?? {};

    // const signers = await ReportSigners.findOne({
    //   where: { class_id: levParams, semester: semester },
    // });

    const signatureKepalaSekolah = await EmployeeSignature.findOne({
      where: { is_headmaster: true, headmaster_of: level },
    });
    const signatureWaliKelas = await EmployeeSignature.findOne({
      where: { is_form_teacher: true, form_teacher_class_id: levParams },
    });

    // const { head, facilitator } = signers || {};

    const result = {
      academic_year: sClass?.academic_year,
      class_name: sClass?.class?.class_name,
      student_id: sClass?.student_id,
      semester,
      full_name: sClass?.student?.full_name,
      nisn: sClass?.student?.nisn,
      nis: sClass?.student?.nis,
      narrative_categories: nCategories.map((nCategory) => ({
        id: nCategory.id,
        category: nCategory.category,
        narrative_sub_categories: nSubCategory
          .filter((nSub) => nSub.narrative_cat_id === nCategory.id)
          .map((nSubCategory) => ({
            id: nSubCategory.id,
            narrative_cat_id: nSubCategory.narrative_cat_id,
            sub_category: nSubCategory.sub_category,
            narrative_reports: nReports
              .filter(
                (nRep) =>
                  nRep.narrativedesc.narrative_sub_cat_id === nSubCategory.id
              )
              .map((nReport) => ({
                id: nReport.id,
                desc_id: nReport.narrativedesc.id,
                desc: nReport.narrativedesc.desc,
                grade: nReport.grade,
              })),
          })),
        narrative_category_comments:
          nComments
            .filter((nComment) => nComment.narrative_cat_id === nCategory.id)
            .map((nComment) => ({
              comments: nComment.comments,
            }))[0] || {},
      })),
      nar_teacher_comments: nar_teacher_comments || "",
      nar_parent_comments: nar_parent_comments || "",
      head: signatureKepalaSekolah || "",
      facilitator: signatureWaliKelas || "",
    };

    return result;
  }

  async filteredByParams(academic, semester, classId) {
    let params = {};

    if (semester) {
      params["$studentreport.semester$"] = semester;
    }
    if (academic) {
      params["$studentreport.studentclass.academic_year$"] = academic;
    }
    if (classId) {
      params["$studentreport.studentclass.class_id$"] = classId;
    }

    return NarrativeReport.findAll({
      where: params,
      include: [
        {
          model: NarrativeDesc,
          include: [
            {
              model: NarrativeSubCategory,
              attributes: ["id", "narrative_cat_id", "code", "sub_category"],
              include: [
                {
                  model: NarrativeCategory,
                  attributes: ["id", "category"],
                },
              ],
            },
          ],
        },
        {
          model: StudentReports,
          attributes: {
            exclude: ["parent_comments", "createdAt", "updatedAt"],
          },
          include: [
            {
              model: StudentClass,
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
              include: [
                {
                  model: Classes,
                  attributes: ["id", "class_name"],
                },
              ],
            },
          ],
        },
      ],
      order: [["id", "ASC"]],
    });
  }
}
module.exports = NarrativeReportDao;
