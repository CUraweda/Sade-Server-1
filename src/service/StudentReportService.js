const httpStatus = require("http-status");
const StudentReportDao = require("../dao/StudentReportDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const fs = require("fs").promises;
const { PDFDocument } = require("pdf-lib");
const path = require("path");
const PDFDocumentExp = require("pdfkit-table");
const fsExp = require("fs");

const dir = "./files/student_reports/";
const temp_dir = "./files/temp/";

class StudentReportService {
  constructor() {
    this.studentReportDao = new StudentReportDao();
  }

  createStudentReport = async (reqBody) => {
    try {
      let message = "Student report successfully added.";

      const chkExist = await this.studentReportDao.findOneByWhere({
        student_class_id: reqBody.student_class_id,
        semester: reqBody.semester,
      });

      if (chkExist) {
        return responseHandler.returnError(
          httpStatus.OK,
          "Student report already exist."
        );
      }

      let data = await this.studentReportDao.create(reqBody);

      if (!data) {
        message = "Failed to create student report.";
        return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
      }

      return responseHandler.returnSuccess(httpStatus.CREATED, message, data);
    } catch (e) {
      logger.error(e);
      return responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Something went wrong!"
      );
    }
  };

  updateStudentReportAccess = async (id) => {
    const message = 'Student report access successfully updated!';

    let rel = await this.studentReportDao.findById(id);

		if (!rel) {
			return responseHandler.returnSuccess(httpStatus.OK, 'Student report not found!', {});
		}

    const updateData = await this.studentReportDao.updateById({ student_access: !rel.student_access }, id);

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  }

  updateStudentReport = async (id, body) => {
    const message = "Student report successfully updated!";

    let rel = await this.studentReportDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student report not found!",
        {}
      );
    }

    const updateData = await this.studentReportDao.updateById(body, id);

    if (updateData) {
      if (!fsExp.existsSync(temp_dir)) {
        fsExp.mkdirSync(temp_dir, { recursive: true });
      }

      const data = await this.studentReportDao.findById(id);
      if (body.nar_teacher_comments || body.nar_parent_comments) {
        const pdfFileNar = await this.generatePdf(data, temp_dir);
        await this.studentReportDao.updateById(
          { nar_comments_path: pdfFileNar },
          id
        );
      }

      if (body.por_teacher_comments || body.por_parent_comments) {
        const pdfFilePor = await this.generatePdf(data, temp_dir);
        await this.studentReportDao.updateById(
          { por_comments_path: pdfFilePor },
          id
        );
      }
      return responseHandler.returnSuccess(httpStatus.OK, message, updateData);
    }
  };

  showStudentReport = async (id) => {
    const message = "Student report successfully retrieved!";

    let rel = await this.studentReportDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student report not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showStudentReportByClassId = async (id, student_access, semester) => {
    const message = "Student report successfully retrieved!";

    let rel = await this.studentReportDao.getByClassId(id, student_access, semester);
    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student report not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showStudentReportByStudentId = async (id, semester) => {
    const message = "Student report successfully retrieved!";

    let rel = await this.studentReportDao.getByStudentId(id, semester);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student report not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showStudentReportByStudentIdDetails = async (id, semester) => {
    const message = "Student report successfully retrieved!";

    let rel = await this.studentReportDao.getByStudentIdDetails(id, semester);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student report not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset, semester) {
    const totalRows = await this.studentReportDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.studentReportDao.getStudentReportPage(
      search,
      semester,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Student report successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  checkReportAccess = async (key, value) => {
    return this.studentReportDao.checkReportAccess(key, value)
  }

  deleteStudentReport = async (id) => {
    const message = "Student report successfully deleted!";

    let rel = await this.studentReportDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student report not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  generatePdf = async (data, path) => {
    const rnd = Date.now();
    const outputFilename = rnd + ".pdf";
    const outputFileName = path + outputFilename;

    let doc = new PDFDocumentExp({ size: "A4", margin: 50 });

    // Pipe the PDF output to a file
    const outputStream = fsExp.createWriteStream(outputFileName);
    doc.pipe(outputStream);

    this.generateTeacherComments(doc, data);
    this.generateParentComments(doc, data);

    // Handle errors in writing to the file
    outputStream.on("error", (err) => {
      console.error(`Error writing to ${outputFileName}: ${err}`);
    });

    doc.end();
    return outputFileName;
  };

  generateTeacherComments = async (doc, data) => {
    // doc.rect(50, 50, 500, 34).lineWidth(0.5).stroke(); // Title border
    // doc.rect(50, 80, 500, 500).lineWidth(0.5).stroke(); // Contents border

    doc.rect(50, 50, 500, 750).lineWidth(0.5).stroke(); //  Page Border

    doc.font("Helvetica-Bold").fontSize(10);
    doc.text("Komentar Guru :", 58, 65);

    doc.font("Helvetica").fontSize(9);
    doc.text(data.nar_teacher_comments, 58, 85, {
      align: "justify",
      width: 482,
    });
  };

  generateParentComments = async (doc, data) => {
    // doc.rect(50, 50, 500, 34).lineWidth(0.5).stroke(); // Title border
    // doc.rect(50, 80, 500, 500).lineWidth(0.5).stroke(); // Contents border

    doc.addPage();

    doc.rect(50, 50, 500, 750).lineWidth(0.5).stroke(); //  Page Border

    doc.font("Helvetica-Bold").fontSize(10);
    doc.text("Komentar Orang Tua :", 58, 65);

    doc.font("Helvetica").fontSize(9);
    doc.text(data.nar_parent_comments, 58, 85, {
      align: "justify",
      width: 482,
    });
  };

  mergeReports = async (id) => {
    const message = "Student report successfully merged!";

    const data = await this.studentReportDao.findById(id);
    if (!data) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student report not found!",
        {}
      );
    }

    const pdf1 = data.number_path || null;
    const pdf2 = data.narrative_path || null;
    const pdf3 = data.portofolio_path || null;

    if (!pdf1 || !pdf2 || !pdf3) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "One or more PDF files not found!",
        {
          number_path: pdf1,
          narrative_path: pdf2,
          portofolio_path: pdf3,
        }
      );
    }

    const merged_path = await this.mergePDFs(pdf1, pdf2, pdf3)
    if(data.merged_path) await fs.unlink(data.merged_path, (err) => { console.log(err) })
    await this.studentReportDao.updateById({ merged_path }, id)
    return responseHandler.returnSuccess(httpStatus.OK, message, { filePath: merged_path });
  };

  mergePDFs = async (pdf1, pdf2, pdf3) => {
    try {
      const pdfBytes1 = await fs.readFile(pdf1);
      const pdfBytes2 = await fs.readFile(pdf2);
      const pdfBytes3 = await fs.readFile(pdf3);

      const pdfDoc1 = await PDFDocument.load(pdfBytes1);
      const pdfDoc2 = await PDFDocument.load(pdfBytes2);
      const pdfDoc3 = await PDFDocument.load(pdfBytes3);

      const mergedPdf = await PDFDocument.create();

      const [copiedPages1, copiedPages2, copiedPages3] = await Promise.all([
        mergedPdf.copyPages(pdfDoc1, pdfDoc1.getPageIndices()),
        mergedPdf.copyPages(pdfDoc2, pdfDoc2.getPageIndices()),
        mergedPdf.copyPages(pdfDoc3, pdfDoc3.getPageIndices()),
      ]);

      copiedPages1.forEach((page) => mergedPdf.addPage(page));
      copiedPages2.forEach((page) => mergedPdf.addPage(page));
      copiedPages3.forEach((page) => mergedPdf.addPage(page));

      const outputPath = path.join(dir, `${Date.now()}_merged_all.pdf`);

      const mergedPdfBytes = await mergedPdf.save();
      await fs.writeFile(outputPath, mergedPdfBytes);

      console.log(
        `PDF files merged successfully. Merged PDF saved at: ${outputPath}`
      );
      return outputPath;
    } catch (error) {
      console.error("Error merging PDFs:", error);
      throw error; // Re-throw the error for the caller to handle
    }
  };

  filteredStudentReport = async (academic, semester, classId) => {
    const message = "Student report successfully retrieved!";

    let rel = await this.studentReportDao.filterByParams(
      academic,
      semester,
      classId
    );

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student report not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = StudentReportService;
