const httpStatus = require("http-status");
const PortofolioReportDao = require("../dao/PortofolioReportDao");
const StudentReportDao = require("../dao/StudentReportDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const fs = require("fs").promises;
const { PDFDocument } = require("pdf-lib");
const path = require("path");
const pdfLib = require('pdf-lib');
const sharp = require('sharp');

const dir = "./files/portofolio_reports/";

class PortofolioReportService {
  constructor() {
    this.portofolioReportDao = new PortofolioReportDao();
    this.studentReportDao = new StudentReportDao();
  }

  createPortofolioReport = async (reqBody) => {
    try {
      let message = "Portofolio report successfully added.";

      let data = await this.portofolioReportDao.create(reqBody);

      if (!data) {
        message = "Failed to create portofolio report.";
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

  updatePortofolioReport = async (id, body) => {
    const message = "Portofolio report successfully updated!";

    let rel = await this.portofolioReportDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Student Task not found!",
        {}
      );
    }

    const updateData = await this.portofolioReportDao.updateById(body, id);

    //delete file if exist
    const rData = rel.dataValues;

    if (rData.file_path) {
      // console.log(rData.cover);
      if (body.file_path) {
        fs.unlink(rData.file_path, (err) => {
          if (err) {
            return responseHandler.returnError(
              httpStatus.NOT_FOUND,
              "Cannot delete attachment!"
            );
          }
          console.log("Delete File successfully.");
        });
      }
    }

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, body);
    }
  };

  showPortofolioReport = async (id) => {
    const message = "Portofolio report successfully retrieved!";

    let rel = await this.portofolioReportDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Portofolio report not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showPortofolioReportByStudentReportId = async (id, type) => {
    const message = "Portofolio report successfully retrieved!";

    let rel = await this.portofolioReportDao.getByStudentReportId(id, type);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Portofolio report not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showAllPortofolioReportByStudentReportId = async (id, type) => {
    const message = "Portofolio report successfully retrieved!";

    let rel = await this.portofolioReportDao.getAllByStudentReportId(id, type);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Portofolio report not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  mergePortofolioReport = async (id) => {
    try {
      let message = "Portofolio report successfully merged!";
      const datas = await this.portofolioReportDao.findByWhere({
        student_report_id: id,
      });
  
      let pdf1 = "";
      let pdf2 = "";
      let mergedPDF = "";
  
      for (const data of datas) {
        if (data.type === "Orang Tua") {
          pdf1 = data.file_path;
        }
        if (data.type === "Guru") {
          pdf2 = data.file_path;
        }
      }
  
      const convertImageToPDF = async (imagePath) => {
        const outputPDFPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.pdf');
        const imageBuffer = await sharp(imagePath).toBuffer();
        const pdfDoc = await pdfLib.PDFDocument.create();
        const image = await pdfDoc.embedJpg(imageBuffer); 
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        const pdfBytes = await pdfDoc.save();
        fs.writeFile(outputPDFPath, pdfBytes);
        return outputPDFPath;
      };
  
      if (pdf1 && (/\.(jpg|jpeg|png)$/i).test(pdf1)) {
        pdf1 = await convertImageToPDF(pdf1);
      }
      if (pdf2 && (/\.(jpg|jpeg|png)$/i).test(pdf2)) {
        pdf2 = await convertImageToPDF(pdf2);
      }
  
      if (pdf1 && pdf2) {
        mergedPDF = await this.mergePDFs(pdf1, pdf2);
        const commentData = await this.studentReportDao.findById(id);
        
        if (commentData.por_comments_path == null) {
          const message = "Portofolio comments are empty. Please make a comment first.";
          return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
        }
        if (commentData) {
          mergedPDF = await this.mergePDFs(mergedPDF, commentData.por_comments_path);
        }

        let check = await this.portofolioReportDao.getByStudentReportId(id, "Merged");
        if (check) {
          await fs.promises.unlink(check.file_path, (err) => {
            if (err) console.log(err);
          });
        }
        
        if (!check) {
          check = await this.portofolioReportDao.create({
            student_report_id: id,
            type: "Merged",
            file_path: mergedPDF,
          });
        } else {
          await this.portofolioReportDao.updateById(
            { type: "Merged", file_path: mergedPDF },
            check.id
          );
        }
        
        await this.studentReportDao.updateWhere(
          { portofolio_path: mergedPDF },
          { id }
        );
      } else {
        message = "Failed to merge Portofolio report. One or more PDF files are missing!";
        return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
      }
      const data = mergedPDF
      return responseHandler.returnSuccess(httpStatus.OK, message, data);
    } catch (error) {
      logger.error("Error merging portfolio report:", error);
      return responseHandler.returnError(httpStatus.BAD_REQUEST, error.message);
    }
  };

  mergePDFs = async (pdf1, pdf2) => {
    try {
      const pdfBytes1 = await fs.readFile(pdf1);
      const pdfBytes2 = await fs.readFile(pdf2);

      const pdfDoc1 = await PDFDocument.load(pdfBytes1);
      const pdfDoc2 = await PDFDocument.load(pdfBytes2);

      const mergedPdf = await PDFDocument.create();

      const [copiedPages1, copiedPages2] = await Promise.all([
        mergedPdf.copyPages(pdfDoc1, pdfDoc1.getPageIndices()),
        mergedPdf.copyPages(pdfDoc2, pdfDoc2.getPageIndices()),
      ]);

      copiedPages1.forEach((page) => mergedPdf.addPage(page));
      copiedPages2.forEach((page) => mergedPdf.addPage(page));

      const outputPath = path.join(dir, `${Date.now()}_merged.pdf`);
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

  deletePortofolioReport = async (id) => {
    const message = "Portofolio report successfully deleted!";

    let rel = await this.portofolioReportDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Portofolio report not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  filteredPortofolioReport = async (academic, semester, classId) => {
    const message = "Portofolio report successfully retrieved!";

    let rel = await this.portofolioReportDao.filteredByParams(
      academic,
      semester,
      classId
    );

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Portofolio report not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = PortofolioReportService;
