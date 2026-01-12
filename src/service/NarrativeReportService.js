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

  showNarrativeReportByStudentId = async (id, semester, academic) => {
    const message = "Narrative Report successfully retrieved!";

    let rel = await this.narrativeReportDao.getByStudentId(id, semester, academic);

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

  exportReportByStudentId = async (id, semester, reportId, academic) => {
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

    let rel = await this.narrativeReportDao.getByStudentId(id, semester, academic);

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

  exportReportByStudentIdPreview = async (id, semester, reportId, academic) => {
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

    let rel = await this.narrativeReportDao.getByStudentId(id, semester, academic);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Narrative Report not found!",
        {}
      );
    }

    const pdfBuffer = await this.generatePdfBuffer(rel);

    return pdfBuffer;
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

  generatePdfBuffer = async (data) => {
    return new Promise((resolve, reject) => {
      const chunks = [];
      const doc = new PDFDocument({ size: "A4", margin: 50 });

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      this.generateHeader(doc, data, "default");
      this.generateContents(doc, data);

      doc.end();
    });
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
// generateContents
generateContents = async (doc, data) => {
  // console.log("generateContents called with data:", data);

  let currentY = 220; // Posisi Y awal konten setelah header

  const ensureNewPage = (doc, data, currentY, headerType = "default") => {
    const pageBottomMargin = 70; // Margin bawah halaman
    if (currentY > (doc.page.height - pageBottomMargin)) {
      doc.addPage();
      this.generateHeader(doc, data, headerType);
      return 220; // Kembali ke Y awal konten setelah header
    }
    return currentY;
  };

  const drawNarrativeTable = (doc, tableData, startY, columnWidths) => {
    let y = startY;
    const startX = 50;
    const cellPadding = 4;

    const gradingColStart = 459;
    const singleGradingColWidth = 85 / 3;

    tableData.forEach((row) => {
      const rowDesc = String(row.desc || '').trim(); 

      const currentDescColWidthForData = columnWidths[0] - (2 * cellPadding);
      const safeCurrentDescColWidthForData = (isNaN(currentDescColWidthForData) || currentDescColWidthForData < 0) ? 390 : currentDescColWidthForData;
      
      doc.font("Helvetica").fontSize(10);
      const lineGap = 2;
      const textOptions = { width: safeCurrentDescColWidthForData, align: 'justify', lineGap };
      const descTextHeight = doc.heightOfString(rowDesc, textOptions);
      const minContentHeight = doc.currentLineHeight() + lineGap;
      const contentHeight = Math.max((descTextHeight - 10), (minContentHeight + 2));
      const actualRowHeight = contentHeight;
      
      y = ensureNewPage(doc, data, y + actualRowHeight, 'default'); 
      
      let currentRowStartY = y;
      
      const fontMetrics = doc._font;
      const fontSize = doc._fontSize;
      const ascent = fontMetrics?.ascender ? (fontMetrics.ascender / 1000) * fontSize : 0;
      const descent = fontMetrics?.descender ? Math.abs((fontMetrics.descender / 1000) * fontSize) : 0;
      const verticalAdjust = (ascent - descent) / 2;
      const textYOffset = currentRowStartY + cellPadding + ((contentHeight - descTextHeight) / 2) - verticalAdjust;
      doc.font("Helvetica").fontSize(10);
      doc.text(rowDesc, startX + cellPadding, textYOffset, textOptions);
      
      doc.font("./src/fonts/fontawesome-webfont.ttf").fontSize(10);
      const iconYOffset = currentRowStartY + (actualRowHeight / 2) - 5; 

      doc.text(row.gradeIcons[0], gradingColStart, iconYOffset, { width: singleGradingColWidth, align: 'center' });
      doc.text(row.gradeIcons[1], gradingColStart + singleGradingColWidth, iconYOffset, { width: singleGradingColWidth, align: 'center' });
      doc.text(row.gradeIcons[2], gradingColStart + (2 * singleGradingColWidth), iconYOffset, { width: singleGradingColWidth, align: 'center' });
      
      doc.font("Helvetica").fontSize(10); 

      doc.moveTo(startX, currentRowStartY + actualRowHeight + 6)
         .lineTo(startX + columnWidths[0] + 85, currentRowStartY + actualRowHeight + 6)
         .lineWidth(0.5)
         .strokeColor("black")
         .stroke();

      y += actualRowHeight;
    });

    return y;
  };

  const categoriesToDisplay = data.narrative_categories.filter((item) => {
  // const categoriesToDisplay = [].filter((item) => {
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
    const currentHeaderType = item.category.toLowerCase().trim().includes("tahsin")
      ? "tahsin"
      : item.category.toLowerCase().trim().includes("english")
      ? "english"
      : "default";

    const minHeightForNewCategory = 20 + 18 + 25 + 10 + 10; 
    if (index !== 0 || currentY + minHeightForNewCategory > (doc.page.height - doc.page.margins.bottom)) {
      doc.addPage();
      this.generateHeader(doc, data, currentHeaderType);
      currentY = 220; 
    } else {
        if (index !== 0) { 
             currentY += 20; // Jeda antar kategori jika di halaman yang sama
        }
    }
    
    doc.font("Helvetica-Bold").fontSize(12).text(item.category, 50, currentY);
    doc.moveTo(50, currentY + 15)
       .lineTo(550, currentY + 15)
       .lineWidth(1.5)
       .strokeColor("black")
       .stroke();
    

    item.narrative_sub_categories.forEach((sub_cat, subIndex) => {
      if (sub_cat.narrative_reports && sub_cat.narrative_reports.length > 0) {
       
        let requiredSpaceForSubCategoryTitle = 8; 
        let requiredSpaceForNarrativeTableHeader = 10;

        if (subIndex === 0) {
            currentY += 8; 
            const totalRequired = requiredSpaceForSubCategoryTitle + requiredSpaceForNarrativeTableHeader + 5; // +5 untuk margin minimal
            currentY = ensureNewPage(doc, data, currentY + totalRequired, currentHeaderType);

        } else {
          
            currentY += 10; 
            const totalRequired = requiredSpaceForSubCategoryTitle + requiredSpaceForNarrativeTableHeader + 5;
            currentY = ensureNewPage(doc, data, currentY + totalRequired, currentHeaderType);
        }
       
        doc.font("Helvetica-Bold").fontSize(10).text(sub_cat.sub_category, 50, currentY); 

        doc.moveTo(50, currentY + 14)
           .lineTo(550, currentY + 14)
           .lineWidth(0.5)
           .strokeColor("black")
           .stroke();
        
        currentY += 8; 
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

        currentY = drawNarrativeTable(doc, narrativeTableRows, currentY, narrativeColumnWidths);
        
        currentY += 10; 
      }
    });

    currentY += 5; 

    if (item.narrative_category_comments.comments) {
      currentY = ensureNewPage(doc, data, currentY + 30, "comment"); 
      doc
        .font("Helvetica-BoldOblique")
        .fontSize(10)
        .text("Komentar :", 50, currentY);

      currentY += 15; 

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

      currentY += commentHeight + 15;
    }
  });
  
 doc.addPage();
this.generateHeader(doc, data, "comment");
currentY = 220; 

  const generalCommentTextOptions = { width: 500, align: "justify" };
  const commentPageTopY = 220;

  const handleCommentPageAdded = () => {
    this.generateHeader(doc, data, "comment");
    doc.x = 50;
    doc.y = commentPageTopY;
    doc.font("Helvetica").fontSize(10)
  };

  const writeCommentText = (text) => {
    doc.on("pageAdded", handleCommentPageAdded);
    doc.text(text, 50, currentY, generalCommentTextOptions);
    doc.removeListener("pageAdded", handleCommentPageAdded);
    currentY = doc.y;
  };

  if (data.nar_teacher_comments || data.nar_parent_comments) {
    currentY = ensureNewPage(doc, data, currentY + 20, "comment");
    doc.font("Helvetica-Bold").fontSize(14).text("KOMENTAR UMUM", 50, currentY);
    currentY = doc.y + 6;
  }

  if (data.nar_teacher_comments) {
    currentY = ensureNewPage(doc, data, currentY + 12, "comment");
    doc
      .font("Helvetica-BoldOblique")
      .fontSize(10)
      .text("Komentar Guru :", 50, currentY);
    currentY = doc.y + 4;
    doc.font("Helvetica").fontSize(10);
    writeCommentText(data.nar_teacher_comments);
    currentY += 5;
  }

  if (data.nar_parent_comments) {
    if (data.nar_teacher_comments) {
      currentY += 5;
    }

    currentY = ensureNewPage(doc, data, currentY + 12, "comment");
    doc
      .font("Helvetica-BoldOblique")
      .fontSize(10)
      .text("Komentar Orang Tua :", 50, currentY);
    currentY = doc.y + 4;
    doc.font("Helvetica").fontSize(10);
    writeCommentText(data.nar_parent_comments);
    currentY += 5;
  }

currentY += 20

if (currentY + 120 > (doc.page.height - 50)) {
  doc.addPage()
  currentY = 50
}

doc.font("Helvetica").fontSize(10).text("Kepala Sekolah", 70, currentY);
doc.font("Helvetica").fontSize(10).text("Fasilitator", 320, currentY);

const headSignaturePath = data.head?.signature_path || null;
  const facilitatorSignaturePath = data.facilitator?.signature_path || null;
const hasHeadSignature =
  headSignaturePath && fs.existsSync(headSignaturePath);
const hasFacilitatorSignature =
  facilitatorSignaturePath && fs.existsSync(facilitatorSignaturePath);

if (hasHeadSignature || hasFacilitatorSignature) {
  const signatureImageY = currentY + 8;
  if (hasHeadSignature) {
    doc.image(headSignaturePath, 60, signatureImageY, { width: 100, height: 100 });
  }
  if (hasFacilitatorSignature) {
    doc.image(facilitatorSignaturePath, 310, signatureImageY, { width: 100, height: 100 });
  }
  currentY += 100;
} else {
  currentY += 100; // Mengurangi spasi antara label dan nama tanda tangan
}

doc.font("Helvetica-Bold").fontSize(10).text(data.head.signature_name, 70, currentY);
doc.font("Helvetica-Bold").fontSize(10).text(data.facilitator.signature_name, 320, currentY);

};
}

module.exports = NarrativeReportService;
