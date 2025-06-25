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
  console.log("generateContents called with data:", data);

  let currentY = 220; // Tentukan posisi awal untuk kategori pertama
  const gradeHeader2Path = "src/images/grade-header-2.png";
  const gradeHeader3Path = "src/images/grade-header-3.png";

  // Helper function to ensure a new page and set header
  const ensureNewPage = (doc, data, currentY, headerType = "default") => {
    // Memberikan margin bawah yang sedikit lebih besar sebelum addPage
    const pageBottomMargin = 70; // Misalnya, sisa ruang 70 unit dari bawah halaman
    if (currentY > (doc.page.height - pageBottomMargin)) {
      doc.addPage();
      this.generateHeader(doc, data, headerType);
      // Header gambar grade (Jayyid, Jiddan, Mumtaz) perlu diposisikan ulang di setiap halaman baru
      // Ini mengatasi masalah header gambar yang hanya muncul di halaman pertama
      if (headerType === "tahsin") {
        doc.image(gradeHeader2Path, 459, 150, { width: 85 });
      } else if (headerType === "english") {
        doc.image(gradeHeader3Path, 459, 157, { width: 85 });
      } else {
        // Jika tidak ada header spesifik, pastikan tidak ada header gambar yang tersisa
        // Atau cetak header default jika ada
      }
      return 220; // Reset currentY for the new page
    }
    return currentY; // No new page needed, return currentY as is
  };

  // Fungsi bantu untuk menggambar tabel naratif
  const drawNarrativeTable = (doc, tableData, startY, columnWidths, data) => {
    let y = startY;
    const startX = 50; // Posisi X awal tabel
    const cellPadding = 5; // Padding di dalam sel

    // Header Tabel: Deskripsi, Jayyid, Jiddan, Mumtaz
    doc.font("Helvetica-Bold").fontSize(10);
    let xOffset = startX;

    // Hitung posisi Y untuk teks header, berikan padding dari atas sel
    const headerTextY = y + cellPadding;

    doc.text("Deskripsi", xOffset + cellPadding, headerTextY, { width: columnWidths[0] - (2 * cellPadding), align: 'left' });
    xOffset += columnWidths[0];

    // Posisi X untuk Jayyid, Jiddan, Mumtaz harus sama dengan posisi ikon di bawahnya
    // Jadi, kita bisa menggunakan startX + cumulative columnWidths
    doc.text("Jayyid", xOffset, headerTextY, { width: columnWidths[1], align: 'center' });
    xOffset += columnWidths[1];
    doc.text("Jiddan", xOffset, headerTextY, { width: columnWidths[2], align: 'center' });
    xOffset += columnWidths[2];
    doc.text("Mumtaz", xOffset, headerTextY, { width: columnWidths[3], align: 'center' });
    
    // Tinggi baris header - Changed from 'const' to 'let'
    let headerRowHeight = doc.heightOfString("Deskripsi", { width: columnWidths[0] - (2 * cellPadding) }) + (2 * cellPadding);
    if (headerRowHeight < 25) { // Minimum tinggi baris header
        headerRowHeight = 25;
    }

    // Garis horizontal bawah header
    doc.moveTo(startX, y + headerRowHeight)
       .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y + headerRowHeight)
       .lineWidth(0.5)
       .strokeColor("black")
       .stroke();
    
    y += headerRowHeight; // Pindah ke bawah setelah header dan garis

    // Baris Data
    doc.font("Helvetica").fontSize(10);
    tableData.forEach((row, rowIndex) => {
      // Hitung tinggi aktual teks deskripsi untuk baris ini
      const descTextHeight = doc.heightOfString(row.desc, { width: columnWidths[0] - (2 * cellPadding) });
      const actualRowHeight = descTextHeight + (2 * cellPadding); // Padding atas dan bawah untuk teks

      // Pastikan ada ruang untuk baris baru, jika tidak, tambah halaman
      y = ensureNewPage(doc, data, y + actualRowHeight, 'default'); // Panggil ensureNewPage dengan tipe header yang sesuai

      let currentRowStartY = y; // Simpan Y awal baris ini

      // Teks Deskripsi
      doc.text(row.desc, startX + cellPadding, currentRowStartY + cellPadding, { width: columnWidths[0] - (2 * cellPadding), align: 'justify' });
      
      // Grade Icons
      doc.font("./src/fonts/fontawesome-webfont.ttf").fontSize(10); // Ganti font untuk ikon
      const iconYOffset = currentRowStartY + (actualRowHeight / 2) - 5; // Posisikan di tengah vertikal baris

      doc.text(row.gradeIcons[0], startX + columnWidths[0], iconYOffset, { width: columnWidths[1], align: 'center' });
      doc.text(row.gradeIcons[1], startX + columnWidths[0] + columnWidths[1], iconYOffset, { width: columnWidths[2], align: 'center' });
      doc.text(row.gradeIcons[2], startX + columnWidths[0] + columnWidths[1] + columnWidths[2], iconYOffset, { width: columnWidths[3], align: 'center' });
      doc.font("Helvetica").fontSize(10); // Kembali ke font normal

      // Garis horizontal antar baris
      doc.moveTo(startX, currentRowStartY + actualRowHeight)
         .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), currentRowStartY + actualRowHeight)
         .lineWidth(0.5)
         .strokeColor("black")
         .stroke();

      y += actualRowHeight; // Pindah ke bawah untuk baris berikutnya
    });

    return y; // Kembalikan posisi Y setelah tabel selesai digambar
  };

  // Filter kategori yang memiliki sub-kategori dengan laporan
  const categoriesToDisplay = data.narrative_categories.filter((item) => {
    return (
      item.narrative_sub_categories &&
      item.narrative_sub_categories.some(
        (sub_cat) =>
          sub_cat.narrative_reports && sub_cat.narrative_reports.length > 0
      )
    );
  });

  // Kolom lebar untuk tabel naratif: Deskripsi, Jayyid, Jiddan, Mumtaz
  const narrativeColumnWidths = [400, 50, 50, 50]; // Total 550

  // Iterasi hanya kategori yang sudah difilter
  categoriesToDisplay.forEach((item, index) => {
    // HEADER GAMBAR UNTUK SETIAP KATEGORI (JAYYID, JIDDAN, MUMTAZ)
    // Ini harus ditempatkan setelah ensureNewPage untuk halaman baru,
    // atau di dalam ensureNewPage itu sendiri jika fixed di sana.
    // Jika header ini dinamis per kategori, sebaiknya cetak setelah ensureNewPage
    // yang sudah tahu headerType apa yang aktif.
    const currentHeaderType = item.category.toLowerCase().trim().includes("tahsin")
      ? "tahsin"
      : item.category.toLowerCase().trim().includes("english")
      ? "english"
      : "default";

    if (index !== 0) {
      currentY = ensureNewPage(doc, data, 701, currentHeaderType);
    } else {
      currentY = ensureNewPage(doc, data, currentY, currentHeaderType);
    }

    // Posisi gambar grade header
    if (item.category.toLowerCase().trim().includes("tahsin")) {
      doc.image(gradeHeader2Path, 459, 150, { width: 85 });
    } else if (item.category.toLowerCase().trim().includes("english")) {
      doc.image(gradeHeader3Path, 459, 157, { width: 85 });
    }


    doc.font("Helvetica-Bold").fontSize(12).text(item.category, 50, currentY);
    // Garis di bawah judul kategori
    doc.moveTo(50, currentY + 15)
       .lineTo(550, currentY + 15)
       .lineWidth(1.5)
       .strokeColor("black")
       .stroke();
    
    currentY += 25; // Spasi setelah judul kategori dan garis

    item.narrative_sub_categories.forEach((sub_cat) => {
      if (sub_cat.narrative_reports && sub_cat.narrative_reports.length > 0) {
        currentY = ensureNewPage(doc, data, currentY + 15, currentHeaderType); // Cek halaman baru sebelum sub-kategori

        doc.font("Helvetica-Bold").fontSize(11).text(sub_cat.sub_category, 50, currentY);
        // Garis di bawah judul sub-kategori
        doc.moveTo(50, currentY + 14)
           .lineTo(550, currentY + 14)
           .lineWidth(0.5)
           .strokeColor("black")
           .stroke();
        
        currentY += 20; // Spasi setelah sub-kategori dan garis

        // Siapkan data untuk tabel naratif sub-kategori ini
        const narrativeTableRows = sub_cat.narrative_reports.map(report => {
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

        // Gambar tabel naratif untuk sub-kategori ini
        currentY = drawNarrativeTable(doc, narrativeTableRows, currentY, narrativeColumnWidths, data);
        
        currentY += 15; // Spasi setelah tabel naratif
      }
    });

    currentY += 10;

    if (item.narrative_category_comments.comments) {
      currentY = ensureNewPage(doc, data, currentY + 50, "comment");
      doc
        .font("Helvetica-BoldOblique")
        .fontSize(10)
        .text("Komentar :", 50, currentY);

      currentY += 20;

      const commentTextOptions = { align: "justify", width: 500 };
      const commentHeight = doc.heightOfString(item.narrative_category_comments.comments, commentTextOptions);

      doc
        .font("Helvetica")
        .fontSize(10)
        .text(
          item.narrative_category_comments.comments,
          50,
          currentY,
          commentTextOptions
        );

      currentY += commentHeight + 20;
    }
  });

  // --- BAGIAN KOMENTAR UMUM DAN TANDA TANGAN ---
  doc.addPage();
  this.generateHeader(doc, data, "comment");
  currentY = 220;

  const generalCommentTextOptions = { width: 500, align: "justify" };

  if (data.nar_teacher_comments || data.nar_parent_comments) {
    doc.font("Helvetica-Bold").fontSize(14).text("KOMENTAR UMUM", 50, currentY);
    currentY += 20;
  }

  if (data.nar_teacher_comments) {
    doc.font("Helvetica-BoldOblique").fontSize(10).text("Komentar Guru :", 50, currentY);
    currentY += 20;

    const teacherCommentHeight = doc.heightOfString(data.nar_teacher_comments, generalCommentTextOptions);
    doc.font("Helvetica").fontSize(10).text(data.nar_teacher_comments, 50, currentY, generalCommentTextOptions);
    currentY += teacherCommentHeight + 20;
  }

  if (data.nar_parent_comments) {
    if (data.nar_teacher_comments) {
      currentY += 10;
    }

    doc.font("Helvetica-BoldOblique").fontSize(10).text("Komentar Orang Tua :", 50, currentY);
    currentY += 20;

    const parentCommentHeight = doc.heightOfString(data.nar_parent_comments, generalCommentTextOptions);
    doc.font("Helvetica").fontSize(10).text(data.nar_parent_comments, 50, currentY, generalCommentTextOptions);
    currentY += parentCommentHeight + 20;
  }

  // --- Bagian Tanda Tangan ---
  currentY = ensureNewPage(doc, data, currentY + 50);

  doc.font("Helvetica").fontSize(10).text("Kepala Sekolah", 70, currentY, { width: 250, align: "left" });
  doc.font("Helvetica").fontSize(10).text("Fasilitator", 320, currentY, { width: 250, align: "left" });

  currentY += 70;

  doc.font("Helvetica-Bold").fontSize(10).text(data.head, 70, currentY, { width: 250, align: "left" });
  doc.font("Helvetica-Bold").fontSize(10).text(data.facilitator, 320, currentY, { width: 250, align: "left" });
};
}

module.exports = NarrativeReportService;
