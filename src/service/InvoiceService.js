const PDFDocument = require("pdfkit");
const fs = require("fs");

class InvoiceService {
  constructor() {}

  createInvoice = async (invoice, path) => {
    let doc = new PDFDocument({ size: "A4", margin: 50 });

    this.generateHeader(doc);
    this.generateCustomerInformation(doc, invoice);
    this.generateInvoiceTable(doc, invoice);
    this.generateFooter(doc);

    doc.end();
    doc.pipe(fs.createWriteStream(path));
  };

  generateHeader = async (doc) => {
    doc
      .image("src/images/logo.png", 50, 45, { width: 50 })
      .fillColor("#444444")
      .fontSize(20)
      .text("Sekolah Alam Depok", 110, 57)
      .fontSize(10)
      .text("Sekolah Alam Depok", 200, 50, { align: "right" })
      .text("Jalan Bungsan No. 80 Kelurahan Bedahan", 200, 65, {
        align: "right",
      })
      .text("Sawangan, Kota Depok", 200, 80, { align: "right" })
      .moveDown();
  };

  generateCustomerInformation = async (doc, invoice) => {
    doc.fillColor("#444444").fontSize(20).text("BUKTI PEMBAYARAN", 50, 160);

    this.generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
      .fontSize(10)
      .text("Nomor Invoice", 50, customerInformationTop)
      .font("Helvetica-Bold")
      .text(": " + invoice.invoice_no, 150, customerInformationTop)
      .font("Helvetica")
      .text("Tanggal", 50, customerInformationTop + 15)
      .text(
        ": " + this.formatDate(new Date(invoice.payment_date)),
        150,
        customerInformationTop + 15
      )
      .text("Kelas", 50, customerInformationTop + 30)
      .text(
        ": " + invoice.studentclass.class.class_name,
        150,
        customerInformationTop + 30
      )

      .font("Helvetica-Bold")
      .text(invoice.studentclass.student.full_name, 300, customerInformationTop)
      .font("Helvetica")
      .text(invoice.studentclass.student.nis, 300, customerInformationTop + 15)
      .moveDown();

    this.generateHr(doc, 252);
  };

  generateInvoiceTable = async (doc, invoice) => {
    let i;
    const invoiceTableTop = 330;

    doc.font("Helvetica-Bold");
    this.generateTableRow(
      doc,
      invoiceTableTop,
      "No",
      "Deskripsi",
      "Jumlah (Rp.)"
    );
    this.generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    for (i = 0; i < 1; i++) {
      // const item = invoice.items[i];
      const position = invoiceTableTop + (i + 1) * 30;
      this.generateTableRow(
        doc,
        position,
        1,
        // invoice.remark,
        invoice.desc,
        this.formatCurrency(invoice.bill_amount)
      );

      this.generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    this.generateTableRow(
      doc,
      subtotalPosition,
      "",
      "Total",
      this.formatCurrency(invoice.bill_amount)
    );
  };

  generateFooter = async (doc) => {
    doc
      .fontSize(10)
      .text("Terima kasih sudah melakukan pembayaran tepat waktu.", 50, 780, {
        align: "center",
        width: 500,
      });
  };

  generateTableRow = async (doc, y, item, description, lineTotal) => {
    doc
      .fontSize(10)
      .text(item, 50, y)
      .text(description, 150, y)
      .text(lineTotal, 0, y, { align: "right" });
  };

  generateHr = async (doc, y) => {
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  };

  formatCurrency = (cents) => {
    const rupiah = cents.toFixed(2);
    const formattedRupiah = parseFloat(rupiah).toLocaleString("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return "Rp." + formattedRupiah;
  };

  formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return day + "/" + month + "/" + year;
  };

  getInvoiceNo = async () => {
    const prefix = "INV-";

    const min = 10000; // Minimum 5-digit number
    const max = 99999; // Maximum 5-digit number
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    const invoiceNo = prefix + randomNumber + Date.now().toString();

    return invoiceNo;
  };
}
module.exports = InvoiceService;
