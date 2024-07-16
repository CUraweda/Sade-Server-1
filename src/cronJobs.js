const cron = require('node-cron');
const sycnReportAccessByPayment = require('./service/cron/SyncReportAccessByPaymentBills');

// Sync report access by bills
cron.schedule('*/30 * * * *', sycnReportAccessByPayment);
