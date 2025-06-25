const httpStatus = require("http-status");
const NarrativeReportDao = require("../dao/NarrativeReportDao");
const StudentReportDao = require("../dao/StudentReportDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const xlsx = require("xlsx");

const moment = require("moment");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const dir = "./files/narrative_reports/";

class NarrativeReportService {
  constructor() {
    this.narrativeReportDao = new NarrativeReportDao();
    this.studentReportDao = new StudentReportDao();
  }

  createNarrativeReport = async (reqBody) => {
    try {
      let message = "Narrative Report successfully added.";

      console.log("reqBody", reqBody);

      let data = await this.narrativeReportDao.create(reqBody);

      if (!data) {
        message = "Failed to create Narrative Report.";
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

  updateNarrativeReport = async (id, body) => {
    const message = "Narrative Report successfully updated!";

    let rel = await this.narrativeReportDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Narrative Report not found!",
        {}
      );
    }

    const updateData = await this.narrativeReportDao.updateById(body, id);

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showNarrativeReport = async (id) => {
    const message = "Narrative Report successfully retrieved!";

    let rel = await this.narrativeReportDao.getById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Narrative Report not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  filteredNarrativeReport = async (academic, semester, classId) => {
    const message = "Narrative report successfully retrieved!";

    let rel = await this.narrativeReportDao.filteredByParams(
      academic,
      semester,
      classId
    );

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Narrative report not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.narrativeReportDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.narrativeReportDao.getNarrativeReportPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Narrative Report successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteNarrativeReport = async (id) => {
    const message = "Narrative Report successfully deleted!";

    let rel = await this.narrativeReportDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Narrative Report not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showNarrativeReportByStudentId = async (id, semester) => {
    const message = "Narrative Report successfully retrieved!";

    let rel = await this.narrativeReportDao.getByStudentId(id, semester);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Narrative Report not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  importFromExcel = async (req) => {
    try {
      let message = "Narrative reports successfully imported.";

      const workbook = xlsx.readFile(req.file.path);

      // Assuming there is only one sheet in the Excel file
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet data to JSON
      const jsonData = xlsx.utils.sheet_to_json(sheet);
      let data = await this.narrativeReportDao.bulkCreate(jsonData);

      if (!data) {
        message = "Failed to add narrative reports.";
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

  exportReportByStudentId = async (id, semester, reportId) => {
    let message = "Narrative Report successfully exported!";
    if (!semester)
      return responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Please specify Semester Query"
      );
    if (!reportId)
      return responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Please specify Report ID Query"
      );

    let rel = await this.narrativeReportDao.getByStudentId(id, semester);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Narrative Report not found!",
        {}
      );
    }

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const pdfFile = await this.generatePdf(rel, dir);

    await this.studentReportDao.updateWhere(
      { narrative_path: pdfFile },
      { id: reportId }
    );

    return responseHandler.returnSuccess(httpStatus.OK, message, {
      path: pdfFile,
    });
  };

  generatePdf = async (data, path) => {
    const rnd = Date.now();
    const outputFilename = rnd + "_" + data.full_name + ".pdf";
    const outputFileName = path + outputFilename;

    let doc = new PDFDocument({ size: "A4", margin: 50 });

    // Pipe the PDF output to a file
    const outputStream = fs.createWriteStream(outputFileName);
    doc.pipe(outputStream);

    // this.generateCover(doc, data);
    // this.generateCover2(doc, data);
    this.generateHeader(doc, data, "default");
    this.generateContents(doc, data);

    // Handle errors in writing to the file
    outputStream.on("error", (err) => {
      console.error(`Error writing to ${outputFileName}: ${err}`);
    });

    doc.end();
    // return data;
    return outputFileName;
  };

  generateCover = async (doc, data) => {
    // Load the image
    const imagePath = "src/images/narasi-cover.png"; // Replace 'image.jpg' with the path to your image file
    const image = doc.openImage(imagePath);

    // Calculate the width of A4 paper with margins
    const width =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    // Calculate the height proportionally to maintain aspect ratio
    const height = (image.height / image.width) * width;

    // Calculate the position to center the image on the page
    const x = doc.page.margins.left;
    const y = doc.page.height - doc.page.margins.bottom - height;

    const A4_WIDTH = 595.28; // in points (1 inch = 72 points)
    const A4_HEIGHT = 841.89; // in points

    // Set up text properties
    const fontSize = 14;
    const textFullName = data.full_name;
    const textNisn = data.nisn === null || undefined ? "-" : data.nisn;

    // Calculate the center of the page
    const centerX = A4_WIDTH / 2;
    const centerY = A4_HEIGHT / 2;

    // Calculate the text width dynamically
    const textWidthFullName = doc.widthOfString(textFullName);

    // Calculate the coordinates for placing the text in the middle
    const textX_FullName = centerX - textWidthFullName / 2;
    const textY_FullName = centerY - fontSize / 2; // Adjust for baseline

    // Calculate the text width dynamically
    const textWidthNisn = doc.widthOfString(textNisn);

    const textX_Nisn = centerX - textWidthNisn / 2;
    const textY_Nisn = centerY - fontSize / 2; // Adjust for baseline

    // Draw the image onto the PDF document
    doc.image(image, x, y, { width });
    doc
      .fontSize(fontSize)
      .text(textFullName, textX_FullName - 10, textY_FullName + 95)
      .text(textNisn, textX_Nisn - 10, textY_Nisn + 165);
  };

  generateCover2 = async (doc, data) => {
    const A4_WIDTH = 595.28; // in points (1 inch = 72 points)
    const A4_HEIGHT = 841.89; // in points

    // Set up text properties
    const fontSize = 16;
    const textFullName = data.full_name;
    const textNisn = data.nisn === null || undefined ? "-" : data.nisn;

    // Calculate the center of the page
    const centerX = A4_WIDTH / 2;
    const centerY = A4_HEIGHT / 2;

    // Calculate the text width dynamically
    const textWidthFullName = doc.widthOfString(textFullName);

    // Calculate the coordinates for placing the text in the middle
    const textX_FullName = centerX - textWidthFullName / 2;
    const textY_FullName = centerY - fontSize / 2; // Adjust for baseline

    // Calculate the text width dynamically
    const textWidthNisn = doc.widthOfString(textNisn);

    const textX_Nisn = centerX - textWidthNisn / 2;
    const textY_Nisn = centerY - fontSize / 2; // Adjust for baseline

    doc.addPage();
    doc
      .fontSize(fontSize)
      .text(textFullName, textX_FullName - 10, textY_FullName + 95)
      .text(textNisn, textX_Nisn - 10, textY_Nisn + 165);
  };

  // generateHeader
  generateHeader = async (doc, data, type) => {
    doc.page.margins = { top: 20, bottom: 20, left: 40, right: 40 };

    const imagePath = "src/images/kop_sade.png";
    const image = doc.openImage(imagePath);

    const gradeHeader1Path = "src/images/grade-header-1.png";
    const gradeHeader1 = doc.openImage(gradeHeader1Path);

    const gradeHeader2Path = "src/images/grade-header-2.png";
    const gradeHeader2 = doc.openImage(gradeHeader2Path);

    const gradeHeader3Path = "src/images/grade-header-3.png";
    const gradeHeader3 = doc.openImage(gradeHeader3Path);

    const width =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const height = (image.height / image.width) * width;

    const x = doc.page.margins.left;
    const y = doc.page.margins.top;

    doc.image(image, x, y, { width });

    doc.moveTo(50, 111);
    doc.lineTo(550, 111);
    doc.lineWidth(1);
    doc.strokeColor("black");
    doc.stroke();

    doc.moveTo(50, 111);
    doc.lineTo(275, 111);
    doc.lineWidth(2);
    doc.strokeColor("black");
    doc.stroke();

    doc.moveTo(350, 111);
    doc.lineTo(550, 111);
    doc.lineWidth(2);
    doc.strokeColor("black");
    doc.stroke();

    doc.font("Helvetica").fontSize(9);
    doc.text("Nama", 50, 100).text(": " + data.full_name, 80, 100);
    doc
      .text("Semester/Tahun", 350, 100)
      .text(": " + data.semester + " / " + data.academic_year, 420, 100);
    doc.text("NIS", 50, 115).text(": " + data.nis, 80, 115);
    doc.text("Kelas", 350, 115).text(": " + data.class_name, 420, 115);

    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .text("Rapor Narasi Semester " + data.semester, 50, 150)
      .text("Tahun Ajaran " + data.academic_year, 50, 170)
      .text(data.class_name, 50, 190);

    // Penyesuaian posisi Y untuk gambar header grade
    // Nilai 140 adalah percobaan, sesuaikan lagi jika belum pas
    const gradeHeaderY = 140;
    if (type === "default") {
      doc.image(gradeHeader1, 459, gradeHeaderY, { width: 85 });
    } else if (type === "tahsin") {
      doc.image(gradeHeader2, 459, gradeHeaderY, { width: 85 });
    } else if (type === "english") {
      doc.image(gradeHeader3, 459, gradeHeaderY + 7, { width: 85 }); // English mungkin sedikit berbeda posisinya
    }
  };

  generateContents = async (doc, data) => {
    let currentY = 220;

    const ensureNewPage = (doc, data, currentY, headerType = "default") => {
      const pageBottomMargin = 70;
      if (currentY > doc.page.height - pageBottomMargin) {
        doc.addPage();
        this.generateHeader(doc, data, headerType);
        return 220;
      }
      return currentY;
    };

    const drawNarrativeTable = (doc, tableData, startY, columnWidths) => {
      let y = startY;
      const startX = 50;
      const cellPadding = 2;
      const rowMinHeight = 15;

      doc.font("Helvetica-Bold").fontSize(10);
      let xColHeader = startX;

      const headerTextY = y + cellPadding;

      const currentDescColWidth = columnWidths[0] - 2 * cellPadding;
      const safeCurrentDescColWidth =
        isNaN(currentDescColWidth) || currentDescColWidth < 0
          ? 390
          : currentDescColWidth;

      doc.text("Deskripsi", xColHeader + cellPadding, headerTextY, {
        width: safeCurrentDescColWidth,
        align: "left",
      });
      xColHeader += columnWidths[0];

      const gradingColStart = 459;
      const singleGradingColWidth = 85 / 3;

      let headerRowHeight =
        doc.heightOfString("Deskripsi", { width: safeCurrentDescColWidth }) +
        2 * cellPadding;
      if (headerRowHeight < 25) {
        headerRowHeight = 25;
      }

      doc
        .moveTo(startX, y + headerRowHeight)
        .lineTo(startX + columnWidths[0] + 85, y + headerRowHeight)
        .lineWidth(0.5)
        .strokeColor("black")
        .stroke();

      y += headerRowHeight;

      doc.font("Helvetica").fontSize(10);
      tableData.forEach((row, rowIndex) => {
        const rowDesc = String(row.desc || "");

        const currentDescColWidthForData = columnWidths[0] - 2 * cellPadding;
        const safeCurrentDescColWidthForData =
          isNaN(currentDescColWidthForData) || currentDescColWidthForData < 0
            ? 390
            : currentDescColWidthForData;

        const descTextHeight = doc.heightOfString(rowDesc, {
          width: safeCurrentDescColWidthForData,
        });
        let actualRowHeight = descTextHeight + 2 * cellPadding;
        if (actualRowHeight < rowMinHeight) {
          actualRowHeight = rowMinHeight;
        }

        y = ensureNewPage(doc, data, y + actualRowHeight, "default");

        let currentRowStartY = y;

        doc.text(
          rowDesc,
          startX + cellPadding,
          currentRowStartY + cellPadding,
          { width: safeCurrentDescColWidthForData, align: "justify" }
        );

        doc.font("./src/fonts/fontawesome-webfont.ttf").fontSize(10);
        const iconYOffset = currentRowStartY + actualRowHeight / 2 - 10 / 2;

        doc.text(row.gradeIcons[0], gradingColStart, iconYOffset, {
          width: singleGradingColWidth,
          align: "center",
        });
        doc.text(
          row.gradeIcons[1],
          gradingColStart + singleGradingColWidth,
          iconYOffset,
          { width: singleGradingColWidth, align: "center" }
        );
        doc.text(
          row.gradeIcons[2],
          gradingColStart + 2 * singleGradingColWidth,
          iconYOffset,
          { width: singleGradingColWidth, align: "center" }
        );
        doc.font("Helvetica").fontSize(10);

        doc
          .moveTo(startX, currentRowStartY + actualRowHeight)
          .lineTo(
            startX + columnWidths[0] + 85,
            currentRowStartY + actualRowHeight
          )
          .lineWidth(0.5)
          .strokeColor("black")
          .stroke();

        y += actualRowHeight;
      });

      return y;
    };

    const categoriesToDisplay = data.narrative_categories.filter((item) => {
      return (
        item.narrative_sub_categories &&
        item.narrative_sub_categories.some(
          (sub_cat) =>
            sub_cat.narrative_reports && sub_cat.narrative_reports.length > 0
        )
      );
    });

    const narrativeColumnWidths = [400, 50, 50, 50];

    categoriesToDisplay.forEach((item, index) => {
      const currentHeaderType = item.category
        .toLowerCase()
        .trim()
        .includes("tahsin")
        ? "tahsin"
        : item.category.toLowerCase().trim().includes("english")
        ? "english"
        : "default";

      if (index !== 0) {
        currentY = ensureNewPage(doc, data, currentY + 30, currentHeaderType); // Mengurangi dari 701 (full new page) menjadi sedikit jeda jika di halaman yang sama, atau memaksa halaman baru
      } else {
        currentY = ensureNewPage(doc, data, currentY, currentHeaderType);
      }

      if (currentY === 220 && index !== 0) {
        currentY = 220; // Pastikan mulai dari posisi standar setelah header
      } else if (currentY > 220 && index === 0) {
        // Jika kategori pertama, tapi currentY belum 220
      } else {
        // Ini kasus kategori di halaman yang sama setelah konten lain
        currentY += 20; // Sedikit jeda dari konten sebelumnya di halaman yang sama
      }

      doc.font("Helvetica-Bold").fontSize(12).text(item.category, 50, currentY);
      doc
        .moveTo(50, currentY + 15)
        .lineTo(550, currentY + 15)
        .lineWidth(1.5)
        .strokeColor("black")
        .stroke();

      currentY += 20; // Sebelumnya 25

      item.narrative_sub_categories.forEach((sub_cat, subIndex) => {
        if (sub_cat.narrative_reports && sub_cat.narrative_reports.length > 0) {
          // Jeda antara sub-kategori
          if (subIndex !== 0) {
            // Jika ini bukan sub-kategori pertama dalam kategori ini
            currentY += 10; // Mengurangi jeda antar sub-kategori
          }

          currentY = ensureNewPage(doc, data, currentY + 15, currentHeaderType); // Pastikan ada ruang untuk judul sub-kategori

          doc
            .font("Helvetica-Bold")
            .fontSize(11)
            .text(sub_cat.sub_category, 50, currentY);
          doc
            .moveTo(50, currentY + 14)
            .lineTo(550, currentY + 14)
            .lineWidth(0.5)
            .strokeColor("black")
            .stroke();

          // Mengurangi jeda setelah garis judul sub-kategori
          currentY += 18; // Sebelumnya 20

          const narrativeTableRows = sub_cat.narrative_reports.map((report) => {
            let gradeIcons = ["", "", ""];
            switch (report.grade) {
              case 1:
                gradeIcons = ["", "", ""];
                break;
              case 2:
                gradeIcons = ["", "", ""];
                break;
              case 3:
                gradeIcons = ["", "", ""];
                break;
            }
            return {
              desc: report.desc,
              gradeIcons: gradeIcons,
            };
          });

          currentY = drawNarrativeTable(
            doc,
            narrativeTableRows,
            currentY,
            narrativeColumnWidths
          );

          // Mengurangi jeda setelah tabel naratif
          currentY += 10; // Sebelumnya 15
        }
      });

      // Mengurangi jeda setelah semua sub-kategori dalam sebuah kategori
      currentY += 5; // Sebelumnya 10

      if (item.narrative_category_comments.comments) {
        currentY = ensureNewPage(doc, data, currentY + 30, "comment"); // Mengurangi jeda ke komentar kategori
        doc
          .font("Helvetica-BoldOblique")
          .fontSize(10)
          .text("Komentar :", 50, currentY);

        currentY += 15; // Mengurangi jeda setelah "Komentar :"

        const commentTextOptions = { align: "justify", width: 500 };
        const commentHeight = doc.heightOfString(
          item.narrative_category_comments.comments,
          commentTextOptions
        );

        doc
          .font("Helvetica")
          .fontSize(10)
          .text(
            item.narrative_category_comments.comments,
            50,
            currentY,
            commentTextOptions
          );

        currentY += commentHeight + 15; // Mengurangi jeda setelah teks komentar
      }
    });

    // Jeda sebelum KOMENTAR UMUM
    doc.addPage(); // Ini akan selalu membuat halaman baru untuk komentar umum
    this.generateHeader(doc, data, "comment"); // Header baru untuk halaman komentar
    currentY = 220; // Mulai dari posisi standar setelah header halaman baru

    const generalCommentTextOptions = { width: 500, align: "justify" };

    if (data.nar_teacher_comments || data.nar_parent_comments) {
      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .text("KOMENTAR UMUM", 50, currentY);
      currentY += 20;
    }

    if (data.nar_teacher_comments) {
      doc
        .font("Helvetica-BoldOblique")
        .fontSize(10)
        .text("Komentar Guru :", 50, currentY);
      currentY += 15; // Mengurangi jeda
      const teacherCommentHeight = doc.heightOfString(
        data.nar_teacher_comments,
        generalCommentTextOptions
      );
      doc
        .font("Helvetica")
        .fontSize(10)
        .text(
          data.nar_teacher_comments,
          50,
          currentY,
          generalCommentTextOptions
        );
      currentY += teacherCommentHeight + 15; // Mengurangi jeda
    }

    if (data.nar_parent_comments) {
      if (data.nar_teacher_comments) {
        currentY += 10; // Jeda antar komentar guru dan ortu
      }

      doc
        .font("Helvetica-BoldOblique")
        .fontSize(10)
        .text("Komentar Orang Tua :", 50, currentY);
      currentY += 15; // Mengurangi jeda
      const parentCommentHeight = doc.heightOfString(
        data.nar_parent_comments,
        generalCommentTextOptions
      );
      doc
        .font("Helvetica")
        .fontSize(10)
        .text(
          data.nar_parent_comments,
          50,
          currentY,
          generalCommentTextOptions
        );
      currentY += parentCommentHeight + 15; // Mengurangi jeda
    }

    currentY = ensureNewPage(doc, data, currentY + 30); // Mengurangi jeda sebelum tanda tangan

    doc
      .font("Helvetica")
      .fontSize(10)
      .text("Kepala Sekolah", 70, currentY, { width: 250, align: "left" });
    doc
      .font("Helvetica")
      .fontSize(10)
      .text("Fasilitator", 320, currentY, { width: 250, align: "left" });

    currentY += 70; // Jeda untuk tanda tangan
   console.log(data.head.signature_name, data.facilitator.signature_name);
   
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(data.head.signature_name, 70, currentY, { width: 250, align: "left" });
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(data.facilitator.signature_name, 320, currentY, { width: 250, align: "left" });
  };
}

module.exports = NarrativeReportService;
