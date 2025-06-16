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

  generateHeader = async (doc, data, type) => {
    // doc.addPage();
    doc.page.margins = { top: 20, bottom: 20, left: 40, right: 40 };

    // Load the image
    const imagePath = "src/images/kop_sade.png";
    const image = doc.openImage(imagePath);

    const gradeHeader1Path = "src/images/grade-header-1.png";
    const gradeHeader1 = doc.openImage(gradeHeader1Path);

    const gradeHeader2Path = "src/images/grade-header-2.png";
    const gradeHeader2 = doc.openImage(gradeHeader2Path);

    const gradeHeader3Path = "src/images/grade-header-3.png";
    const gradeHeader3 = doc.openImage(gradeHeader3Path);
    // Calculate the width of A4 paper with margins
    const width =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    // Calculate the height proportionally to maintain aspect ratio
    const height = (image.height / image.width) * width;

    // Set the image at the top of the page
    const x = doc.page.margins.left;
    const y = doc.page.margins.top; // Set y to the top margin

    // Draw the image onto the PDF document
    doc.image(image, x, y, { width });

    doc.moveTo(50, 111); // starting point x, y
    doc.lineTo(550, 111); // ending point x, y
    doc.lineWidth(1);
    doc.strokeColor("black");
    doc.stroke();

    doc.moveTo(50, 111); // starting point x, y
    doc.lineTo(275, 111); // ending point x, y
    doc.lineWidth(2);
    doc.strokeColor("black");
    doc.stroke();

    doc.moveTo(350, 111); // starting point x, y
    doc.lineTo(550, 111); // ending point x, y
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
    if (type === "default") {
      doc.image(gradeHeader1, 459, 160, { width: 85 });
    } else if (type === "tahsin") {
      doc.image(gradeHeader2, 459, 150, { width: 85 });
    } else if (type === "english") {
      doc.image(gradeHeader3, 459, 157, { width: 85 });
    }
  };

generateContents = async (doc, data) => {
  let currentY = 220; // Tentukan posisi awal untuk kategori pertama
  const gradeHeader2Path = "src/images/grade-header-2.png";
  const gradeHeader3Path = "src/images/grade-header-3.png";

  // Helper function to ensure a new page and set header
  const ensureNewPage = (doc, data, currentY, headerType = "default") => {
    if (currentY > 700) {
      doc.addPage();
      this.generateHeader(doc, data, headerType);
      return 220; // Reset currentY for the new page
    }
    return currentY; // No new page needed, return currentY as is
  };

  data.narrative_categories.forEach((item, index) => {
    // Check for specific headers based on category
    if (item.category.toLowerCase().trim().includes("tahsin")) {
      doc.image(gradeHeader2Path, 459, 150, { width: 85 });
    } else if (item.category.toLowerCase().trim().includes("english")) {
      doc.image(gradeHeader3Path, 459, 157, { width: 85 });
    }

    // Ensure new page for categories (except the first one if it fits)
    if (index !== 0) {
      // Always add page for subsequent categories
      currentY = ensureNewPage(
        doc,
        data,
        701, // Force new page for subsequent categories
        item.category.toLowerCase().trim().includes("tahsin")
          ? "tahsin"
          : "default"
      );
    } else {
      // For the first category, only add page if it doesn't fit the initial space
      currentY = ensureNewPage(
        doc,
        data,
        currentY,
        item.category.toLowerCase().trim().includes("tahsin")
          ? "tahsin"
          : "default"
      );
    }

    doc.font("Helvetica-Bold").fontSize(12).text(item.category, 50, currentY);
    doc
      .moveTo(450, currentY + 12)
      .lineTo(50, currentY + 12)
      .lineWidth(1.5)
      .strokeColor("black")
      .stroke();
    doc
      .moveTo(550, currentY + 12)
      .lineTo(50, currentY + 12)
      .lineWidth(0.5)
      .strokeColor("black")
      .stroke();

    // Tingkatkan posisi Y untuk persiapan menambahkan subkategori
    currentY += 25;

    item.narrative_sub_categories.forEach((sub_cat) => {
      currentY = ensureNewPage(doc, data, currentY); // Check for new page before sub-category title

      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(sub_cat.sub_category, 50, currentY);

      doc
        .moveTo(550, currentY + 12)
        .lineTo(50, currentY + 12)
        .lineWidth(0.5)
        .strokeColor("black")
        .stroke();

      sub_cat.narrative_reports.forEach((report) => {
        currentY = ensureNewPage(doc, data, currentY); // Check for new page before report description

        const textOptions = { width: 400, align: "justify" };
        const textStartX = 50;
        const textStartY = currentY + 20;

        doc
          .font("Helvetica")
          .fontSize(10)
          .text(report.desc, textStartX, textStartY, textOptions);

        let grade = "                ";
        switch (report.grade) {
          case 1:
            grade = "                ";
            break;
          case 2:
            grade = "                ";
            break;
          case 3:
            grade = "                ";
            break;
        }
        doc
          .font("./src/fonts/fontawesome-webfont.ttf")
          .fontSize(10)
          .text(grade, 450, textStartY, {
            align: "center",
          });

        // Calculate height of the description text
        const descHeight = doc.heightOfString(report.desc, textOptions);
        currentY += descHeight + 10; // Add some padding after the text

        doc
          .moveTo(550, currentY) // Adjust line position to be directly after the text + padding
          .lineTo(50, currentY)
          .lineWidth(0.5)
          .strokeColor("black")
          .stroke();
        currentY += 5; // Add a small gap after the line
      });

      currentY += 15; // Tingkatkan posisi Y untuk subkategori berikutnya
    });

    // Tingkatkan posisi Y setelah menambahkan semua subkategori untuk kategori saat ini
    currentY += 10; // Anda bisa menyesuaikan jarak antara kategori dengan subkategori

    if (item.narrative_category_comments.comments) {
      currentY = ensureNewPage(doc, data, currentY + 50, "comment"); // Ensure new page, adding extra space for the comment section title
      doc
        .font("Helvetica-BoldOblique")
        .fontSize(10)
        .text("Komentar :", 50, currentY);

      currentY += 20;

      const commentTextOptions = { align: "justify", width: 500 }; // Define options for comments
      doc
        .font("Helvetica")
        .fontSize(10)
        .text(
          item.narrative_category_comments.comments,
          50,
          currentY,
          commentTextOptions
        );

      currentY +=
        doc.heightOfString(
          item.narrative_category_comments.comments,
          commentTextOptions
        ) + 20; // Update currentY
    }
  });

  // --- BAGIAN BARU: KOMENTAR UMUM DAN TANDA TANGAN DI HALAMAN TERPISAH ---
  // Paksa penambahan halaman baru untuk bagian komentar umum dan tanda tangan
  doc.addPage();
  this.generateHeader(doc, data, "comment"); // Atur header untuk halaman komentar
  currentY = 220; // Reset currentY ke posisi awal halaman baru

  const generalCommentTextOptions = { width: 500, align: "justify" }; // Define text options for general comments

  // Hanya cetak judul "KOMENTAR UMUM" jika ada komentar guru atau orang tua
  if (data.nar_teacher_comments || data.nar_parent_comments) {
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .text("KOMENTAR UMUM", 50, currentY);
    currentY += 20; // Space after title
  }

  // Komentar Guru
  if (data.nar_teacher_comments) {
    doc
      .font("Helvetica-BoldOblique")
      .fontSize(10)
      .text("Komentar Guru :", 50, currentY);
    currentY += 20;

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(
        data.nar_teacher_comments,
        50,
        currentY,
        generalCommentTextOptions
      );

    currentY +=
      doc.heightOfString(
        data.nar_teacher_comments,
        generalCommentTextOptions
      ) + 20;
  }

  // Komentar Orang Tua
  if (data.nar_parent_comments) {
    // Tambahkan sedikit spasi jika ada komentar guru sebelumnya
    if (data.nar_teacher_comments) {
      currentY += 10;
    }

    doc
      .font("Helvetica-BoldOblique")
      .fontSize(10)
      .text("Komentar Orang Tua :", 50, currentY);
    currentY += 20;

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(
        data.nar_parent_comments,
        50,
        currentY,
        generalCommentTextOptions
      );

    currentY +=
      doc.heightOfString(
        data.nar_parent_comments,
        generalCommentTextOptions
      ) + 20;
  }

  // --- Bagian Tanda Tangan ---
  // Pastikan ada cukup ruang untuk tanda tangan di halaman yang sama.
  // Jika tidak, tambahkan halaman baru (jarang terjadi jika sudah dipaksa di awal)
  currentY = ensureNewPage(doc, data, currentY + 50, "comment"); // Tambahkan padding sebelum tanda tangan

  doc
    .font("Helvetica")
    .fontSize(10)
    .text("Kepala Sekolah", 70, currentY, { width: 250, align: "justify" });

  doc
    .font("Helvetica")
    .fontSize(10)
    .text("Fasilitator", 320, currentY, { width: 250, align: "justify" });

  currentY += 70; // Space for signature line

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text(data.head, 70, currentY, { width: 250, align: "justify" });

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text(data.facilitator, 320, currentY, { width: 250, align: "justify" });
};
}

module.exports = NarrativeReportService;
