const { Op } = require('sequelize');
const models = require('../../models');
const moment = require('moment')
require('moment/locale/id')

const StudentReport = models.studentreports;
const StudentBills = models.studentbills;
const StudentPaymentBills = models.studentpaymentbills;
const PaymentPosts = models.paymentpost;
const StudentClass = models.studentclass;

async function sycnReportAccessByPayment(now) {
  try {
    console.log(`\n==== Lock Unlock Report by Bills ====\n[${moment(now).locale("id").format("DD MMMM YYYY HH:mm:ss")}]`)

    const billsInclude = [
      {
        model: StudentPaymentBills,
        as: 'studentpaymentbill',
        attributes: ['academic_year'],
        include: [
          {
            model: PaymentPosts,
            as: 'paymentpost',
            attributes: ['billing_cycle'],
          },
        ],
      },
    ];

    const billsWhere = {
      ['$studentpaymentbill.paymentpost.billing_cycle$']: {
        [Op.like]: 'bulanan',
      },
      updated_at: {
        [Op.gte]: new Date(now.getTime() - 30 * 60000)
      }
    };

    const lunasBills = await StudentBills.findAll({
      where: {
        ...billsWhere,
        status: {
          [Op.like]: 'lunas',
        },
      },
      attributes: ['student_id'],
      include: billsInclude,
    }).then((res) => res);

    const belumLunasBills = await StudentBills.findAll({
      where: {
        ...billsWhere,
        status: {
          [Op.like]: 'belum lunas',
        },
      },
      attributes: ['student_id'],
      include: billsInclude,
    }).then((res) => res);

    console.log(
      `\n---- Student Bills \nLunas (confirmed): ${lunasBills.length};\nBelum Lunas: ${belumLunasBills.length};`
    );

    const reportsToLock = await StudentReport.findAll({
      where: {
        student_access: true,
        ['$studentclass.student_id$']: {
          [Op.in]: belumLunasBills.map((b) => b.student_id),
        },
        ['$studentclass.academic_year$']: {
          [Op.in]: belumLunasBills.map((b) => b.studentpaymentbill.academic_year),
        },
      },
      include: [
        {
          model: StudentClass,
          as: 'studentclass',
          attributes: ['student_id', 'academic_year'],
        },
      ],
    }).then((res) => res);

    const reportsToUnlock = await StudentReport.findAll({
      where: {
        [Op.or]: {
          student_access: null,
          student_access: false
        },
        ['$studentclass.student_id$']: {
          [Op.in]: lunasBills.map((b) => b.student_id),
        },
        ['$studentclass.academic_year$']: {
          [Op.in]: lunasBills.map((b) => b.studentpaymentbill.academic_year),
        },
      },
      include: [
        {
          model: StudentClass,
          as: 'studentclass',
          attributes: ['student_id', 'academic_year'],
        },
      ],
    }).then((res) => res);

    const lockReport = await Promise.all(
      reportsToLock.map((dat) => {
        dat.student_access = false;
        return dat.save();
      })
    );

    const unLockReport = await Promise.all(
      reportsToUnlock.map((dat) => {
        dat.student_access = true;
        return dat.save();
      })
    );

    console.log(
      `\n---- Student Reports \nLocked: ${lockReport.length};\nUnlocked: ${
        unLockReport.length
      };\nAcademic years: ${0};`
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = sycnReportAccessByPayment;
