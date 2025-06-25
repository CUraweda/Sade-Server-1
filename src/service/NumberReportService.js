const httpStatus = require("http-status");
const NumberReportDao = require("../dao/NumberReportDao");
const StudentReportDao = require("../dao/StudentReportDao");
const SubjectDao = require('../dao/SubjectDao')
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const xlsx = require("xlsx");

const moment = require("moment");
const PDFDocument = require("pdfkit-table");
const fs = require("fs");
const dir = "./files/number_reports/";
const models = require("../models");
const { where } = require("sequelize");

class NumberReportService {
  constructor() {
    this.numberReportDao = new NumberReportDao();
    this.studentReportDao = new StudentReportDao();
    this.subjectDao = new SubjectDao()
  }

  formatUID = (data) => {
    return `${data['student_report_id']}|${data['subject_id']}`
  }

  createNumberReport = async (reqBody) => {
    try {
      let message = "Number Report successfully added.";

      reqBody['uid'] = this.formatUID(reqBody)
      let data = await this.numberReportDao.create(reqBody);
      
      if (!data) {
        message = "Failed to create Number Report.";
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

  createBulkNumberReport = async (reqBody) => {
    try {
      let message = "Number Report successfully added.";

      const create = reqBody.map(data => {
        data['uid'] = this.formatUID(data);
        return this.numberReportDao.updateOrCreate(data, { uid: data['uid'] });
      });
    
      const results = await Promise.all(create);
    
      if (!results || results.some(result => !result)) {
        message = "Failed to create Number Report.";
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

  updateNumberReport = async (id, body) => {
    const message = "Number Report successfully updated!";

    let rel = await this.numberReportDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Number Report not found!",
        {}
      );
    }

    const updateData = await this.numberReportDao.updateWhere(
      {
        student_report_id: body.student_report_id,
        subject_id: body.subject_id,
        grade: body.grade,
        grade_text: body.grade_text,
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showNumberReport = async (id) => {
    const message = "Number Report successfully retrieved!";

    let rel = await this.numberReportDao.getById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Number Report not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset, filters) {
    const totalRows = await this.numberReportDao.getCount(search, filters);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.numberReportDao.getNumberReportPage(
      search,
      offset,
      limit,
      filters
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Number Report successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteNumberReport = async (id) => {
    const message = "Number Report successfully deleted!";

    let rel = await this.numberReportDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Number Report not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  deleteAllNumberReports = async () => {
    const message = "All Number Reports successfully deleted!";

    let rel = await this.numberReportDao.deleteAll();

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "No Number Reports found to delete!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };


  showNumberReportByStudentId = async (id, semester) => {
    const message = "Number Report successfully retrieved!";

    let rel = await this.numberReportDao.getByStudentId(id, semester);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.NOT_FOUND,
        "Number Report not found!",
        {}
      );
    }

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // const pdfTest = this.generatePdf(rel, dir);

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  importFromExcel = async (req) => {
    try {
      let message = "Student successfully added.";

      const workbook = xlsx.readFile(req.file.path);

      // Assuming there is only one sheet in the Excel file
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet data to JSON
      const jsonData = xlsx.utils.sheet_to_json(sheet);

      let data = await this.numberReportDao.bulkCreate(jsonData);

      if (!data) {
        message = "Failed to add student.";
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

  exportReportByStudentId = async (id, semester, signedDate) => {
    const message = "Number Report successfully exported!";

    let rel = await this.numberReportDao.getByStudentId(id, semester, true);

    if (rel?.note) {
      return responseHandler.returnError(
        httpStatus.UNPROCESSABLE_ENTITY, rel.note
      );
    }

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const studentRepData = await this.studentReportDao.getByStudentId(
      id,
      semester
    );

    rel['signed_at'] = signedDate
    const pdfFile = await this.generatePdf(rel, dir);

    if (pdfFile) {
      await this.studentReportDao.updateWhere(
        {
          number_path: pdfFile,
        },
        { id: studentRepData[0].id }
      );
    }

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

    this.generateCover(doc, data);
    this.generateHeader(doc, data);
    await this.generateContents(doc, data);

    // this.generateCustomerInformation(doc, invoice);
    // this.generateInvoiceTable(doc, invoice);
    // this.generateFooter(doc);

    // Handle errors in writing to the file
    outputStream.on("error", (err) => {
      console.error(`Error writing to ${outputFileName}: ${err}`);
    });

    doc.end();
    return outputFileName;
  };

  generateCover = async (doc, data) => {
    // Load the image
    const imagePath = "src/images/number-cover.jpg"; // Replace 'image.jpg' with the path to your image file
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

  generateHeader = async (doc) => {
    doc.addPage();
    doc.page.margins = { top: 20, bottom: 20, left: 40, right: 40 };

    // Load the image
    const imagePath = "src/images/header.png"; // Replace 'image.jpg' with the path to your image file
    const image = doc.openImage(imagePath);

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
  };

  generateContents = async (doc, data) => {
    doc
      .fontSize(9)
      .text("Nama Peserta Didik", 50, 150)
      .text(": " + data.full_name, 150, 150, 0);
    doc
      .fontSize(9)
      .text("NISN", 50, 165)
      .text(
        data.nisn === null || undefined ? ": -" : ": " + data.nisn,
        150,
        165,
        0
      );
    doc
      .fontSize(9)
      .text("Kelas", 50, 180)
      .text(
        data.class === null || undefined ? "-" : ": " + data.class,
        150,
        180,
        0
      );

    doc
      .fontSize(9)
      .text("Semester", 400, 165)
      .text(
        data.semester === null || undefined ? ": -" : ": " + data.semester,
        500,
        165,
        0
      );

    doc
      .fontSize(9)
      .text("Tahun Pelajaran", 400, 180)
      .text(
        data.academic_year === null || undefined
          ? "-"
          : ": " + data.academic_year,
        500,
        180,
        0
      );
    // 50: The x-coordinate of the top-left corner of the rectangle.
    // 50: The y-coordinate of the top-left corner of the rectangle.
    // 200: The width of the rectangle.
    // 100: The height of the rectangle.
    let posY = 220;
    doc.font("Helvetica-Bold").fontSize(9);
    doc.rect(50, posY, 30, 34).lineWidth(0.5).stroke(); // No
    doc.text("No", 58, 235);
    doc.rect(80, posY, 170, 34).lineWidth(0.5).stroke(); // Mata Pelajaran
    doc.text("Nama Pelajaran", 88, 235, { align: "center", width: 170 });
    doc.rect(250, posY, 60, 34).lineWidth(0.5).stroke(); //Nilai Ketuntasan
    doc.text("Kriteria\nKetuntasan\nMinimal", 250, 223, {
      align: "center",
      width: 60,
    });
    doc.rect(310, posY, 240, 17).lineWidth(0.5).stroke(); // Nilai
    doc.text("Nilai", 310, 225, { align: "center", width: 240 });
    posY += 17;
    doc.rect(310, posY, 40, 17).lineWidth(0.5).stroke(); // Angka
    doc.text("Angka", 310, 242, { align: "center", width: 40 });
    doc.rect(350, posY, 200, 17).lineWidth(0.5).stroke(); // Huruf
    doc.text("Huruf", 350, 242, { align: "center", width: 200 });

    const { rowsData } = await this.generateNumberReportTabel(data)
    const dataTable = {
      headers: [
        {
          label: "",
          property: "No",
          width: 30,
          renderer: null,
          headerColor: "#FFFFFF",
          align: "center",
        },
        {
          label: "",
          property: "Nama Pelajaran",
          width: 170,
          renderer: null,
          headerColor: "#FFFFFF",
        },
        {
          label: "",
          property: "Kriteria Ketuntasan Minimal",
          width: 60,
          renderer: null,
          headerColor: "#FFFFFF",
          align: "center",
        },
        {
          label: "",
          property: "Angka",
          width: 40,
          renderer: null,
          headerColor: "#FFFFFF",
          align: "center",
        },
        {
          label: "",
          property: "Huruf",
          width: 200,
          renderer: null,
          headerColor: "#FFFFFF",
        },
      ],
      rows: Object.values(rowsData),
    };

    const tableX = 50;
    const tableY = 250;

    doc.table(dataTable, {
      x: tableX,
      y: tableY,
      columnSpacing: 5,
      padding: 5,
      columnsSize: [30, 170, 60, 40, 200],
      align: "center",
      prepareHeader: () => doc.fontSize(9).font("Helvetica-Bold"), // {Function}
      // -----------------------------------------------------------------
      // HERE THE MAGIC:
      // -----------------------------------------------------------------
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        const { x, y, width, height } = rectCell;
        // first line
        if (indexColumn === 0) {
          doc
            .lineWidth(0.5)
            .moveTo(x, y)
            .lineTo(x, y + height)
            .stroke();
        }
        doc
          .lineWidth(0.5)
          .moveTo(x + width, y)
          .lineTo(x + width, y + height)
          .stroke();
        posY = y + height;
        doc.fontSize(9).fillColor("#292929").font("Helvetica");
      }, // {Function}
    });

    posY += 23;
    doc.rect(50, posY, 30, 25).lineWidth(0.5).stroke(); // No
    doc.rect(80, posY, 180, 25).lineWidth(0.5).stroke(); // Kepribadian
    doc.rect(260, posY, 60, 25).lineWidth(0.5).stroke(); // Nilai
    doc.rect(320, posY, 170, 25).lineWidth(0.5).stroke(); // Ketidakhadiran
    doc.rect(490, posY, 60, 25).lineWidth(0.5).stroke(); // Hari

    posY += 10;
    doc.text("No", 50, posY, { align: "center", width: 30 });
    doc.text("Kepribadian", 80, posY, { align: "center", width: 180 });
    doc.text("Nilai", 260, posY, { align: "center", width: 60 });
    doc.text("Ketidakhadiran", 320, posY, { align: "center", width: 170 });
    doc.text("Hari", 490, posY, { align: "center", width: 60 });

    let rowsDataPersonalities = [];

    for (let i = 0; i < data.personalities.length; i++) {
      const item = data.personalities[i];
      switch (i) {
        case 0:
          rowsDataPersonalities.push([
            i + 1,
            item.desc,
            item.grade,
            "Sakit",
            data.attendances.sakit,
          ]);
          break;
        case 1:
          rowsDataPersonalities.push([
            i + 1,
            item.desc,
            item.grade,
            "Izin",
            data.attendances.izin,
          ]);
          break;
        case 2:
          rowsDataPersonalities.push([
            i + 1,
            item.desc,
            item.grade,
            "Tanpa Keterangan",
            data.attendances.tanpa_keterangan,
          ]);
          break;
      }
      // rowsDataPersonalities.push([i + 1, item.desc, item.grade, "", ""]);
    }

    const dataTablePer = {
      headers: [
        {
          label: "",
          property: "No",
          width: 30,
          renderer: null,
          headerColor: "#FFFFFF",
          align: "center",
        },
        {
          label: "",
          property: "Kepribadian",
          width: 180,
          renderer: null,
          headerColor: "#FFFFFF",
        },
        {
          label: "",
          property: "Nilai",
          width: 60,
          renderer: null,
          headerColor: "#FFFFFF",
          align: "center",
        },
        {
          label: "",
          property: "Ketidakhadiran",
          width: 170,
          renderer: null,
          headerColor: "#FFFFFF",
        },
        {
          label: "",
          property: "Nilai",
          width: 60,
          renderer: null,
          headerColor: "#FFFFFF",
          align: "center",
        },
      ],
      rows: rowsDataPersonalities,
    };

    posY += 11;
    const tableXPer = 50;
    const tableYPer = posY;
    doc.table(dataTablePer, {
      x: tableXPer,
      y: tableYPer,
      columnSpacing: 5,
      padding: 5,
      columnsSize: [30, 180, 60],
      align: "center",
      prepareHeader: () => doc.fontSize(9).font("Helvetica-Bold"), // {Function}
      // -----------------------------------------------------------------
      // HERE THE MAGIC:
      // -----------------------------------------------------------------
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        const { x, y, width, height } = rectCell;
        // first line
        if (indexColumn === 0) {
          doc
            .lineWidth(0.5)
            .moveTo(x, y)
            .lineTo(x, y + height)
            .stroke();
        }
        doc
          .lineWidth(0.5)
          .moveTo(x + width, y)
          .lineTo(x + width, y + height)
          .stroke();
        posY = y + height;
        doc.fontSize(9).fillColor("#292929").font("Helvetica");
      }, // {Function}
    });

    posY += 20;
    moment.locale("id"); // Set locale to Indonesian
    const formattedDate = moment(data['signed_at']).format("DD MMMM YYYY");
    doc
      .font("Helvetica")
      .fontSize(9)
      .text("Depok, " + formattedDate, 350, posY, {
        align: "center",
        width: 180,
      });

    posY += 15;
    doc
      .font("Helvetica-Bold")
      .text("Kepala Sekolah", 50, posY, { align: "center", width: 180 })
      .text("Wali Kelas", 350, posY, { align: "center", width: 180 });

    posY += 70;
    doc
      .font("Helvetica")
      .text(data.head?.signature_name || '', 50, 670, { align: "center", width: 180 })
      .text(data.form_teacher?.signature_name || '', 350, 670, { align: "center", width: 180 });
  };

  // generateNumberReportTabel = async (data) => {
  //   const formatter = new Intl.NumberFormat("id-ID", {
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2,
  //   });
  //   let rowsData = { PAI: [1], PKN: [2], IND: [3], MTK: [4], IPA: [5], IPS: [6], KES: [7], PENJAS: [8], ING: [9] }
  //   let subjects = await this.subjectDao.getAll(data.level)
  //   if (!subjects || subjects.length < 1) subjects = await this.subjectDao.findAll({ order: [['id', 'asc']] })
  //   subjects.forEach((subject, i) => {
  //     if (!rowsData[subject.code]) rowsData[subject.code] = [Object.keys(rowsData).length + 1]
  //     if (!rowsData[subject.code][1]) {
  //       rowsData[subject.code].push(subject.name)
  //       rowsData[subject.code].push(formatter.format(subject.threshold ? parseFloat(subject.threshold.toFixed(2)) : 0),)
  //       rowsData[subject.code].push("0,00")
  //       rowsData[subject.code].push("nol")
  //     }
  //   })
  //   for (let item of data.number_reports) {
  //     if (rowsData[item.subject_code]) {
  //       rowsData[item.subject_code][2] = item.threshold
  //       rowsData[item.subject_code][3] = item.grade
  //       rowsData[item.subject_code][4] = item.grade_text
  //     }
  //   }

  //   return { rowsData }
  // }

generateNumberReportTabel = async (data) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const predefinedOrder = ['PAI', 'PAK', 'PKN', 'IND', 'MTK', 'IPA', 'IPS', 'KES', 'PENJAS', 'ING'];

  let allSubjectsFromDB = await this.subjectDao.getAll(data.level);
  if (!allSubjectsFromDB || allSubjectsFromDB.length < 1) {
    allSubjectsFromDB = await this.subjectDao.findAll({ order: [['id', 'asc']] });
  }

  const subjectDetailMap = new Map();
  allSubjectsFromDB.forEach(subject => {
    subjectDetailMap.set(subject.code, subject);
  });

  const validReportMap = new Map();
  for (let item of data.number_reports) {
    // Pastikan item.grade adalah angka sebelum membandingkannya atau menyimpannya
    const gradeAsNumber = parseFloat(item.grade);
    if (gradeAsNumber !== 0 && item.grade_text !== "nol") {
      validReportMap.set(item.subject_code, {
          ...item,
          grade: gradeAsNumber // Simpan sebagai angka di map
      });
    }
  }

  const finalRowsData = {};
  let currentNo = 1;

  for (const subjectCode of predefinedOrder) {
    const subject = subjectDetailMap.get(subjectCode);

    if (subject) {
      if (validReportMap.has(subjectCode)) {
        const report = validReportMap.get(subjectCode);

        // Langsung parseFloat untuk report.grade sebelum diformat
        const gradeFormatted = formatter.format(parseFloat(report.grade));
        const thresholdFormatted = formatter.format(subject.threshold ? parseFloat(subject.threshold.toFixed(2)) : 0);

        finalRowsData[subjectCode] = [
          currentNo,
          subject.name,
          thresholdFormatted,
          gradeFormatted,
          report.grade_text,
        ];
        currentNo++;
      }
    }
  }

  for (const subject of allSubjectsFromDB) {
    if (!predefinedOrder.includes(subject.code)) {
      if (validReportMap.has(subject.code)) {
        const report = validReportMap.get(subject.code);

        // Langsung parseFloat untuk report.grade sebelum diformat
        const gradeFormatted = formatter.format(parseFloat(report.grade));
        const thresholdFormatted = formatter.format(subject.threshold ? parseFloat(subject.threshold.toFixed(2)) : 0);

        finalRowsData[subject.code] = [
          currentNo,
          subject.name,
          thresholdFormatted,
          gradeFormatted,
          report.grade_text,
        ];
        currentNo++;
      }
    }
  }

  const orderedFinalRowsData = {};
  const keysInOrder = [];

  for(const key in finalRowsData) {
      keysInOrder.push({ code: key, no: finalRowsData[key][0] });
  }

  keysInOrder.sort((a, b) => a.no - b.no);

  keysInOrder.forEach(item => {
      orderedFinalRowsData[item.code] = finalRowsData[item.code];
  });

  return { rowsData: orderedFinalRowsData };
};

  filteredNumberReport = async (academic, semester, classId) => {
    const message = "Number report successfully retrieved!";

    let rel = await this.numberReportDao.filteredByParams(
      academic,
      semester,
      classId
    );

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Number report not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = NumberReportService;
