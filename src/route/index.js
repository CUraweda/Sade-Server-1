const express = require("express");
const authRoute = require("./authRoute");
const academicYearRoute = require("./academicYearRoute");
const classesRoute = require("./classesRoute");
const religionRoute = require("./religionRoute");
const studentRoute = require("./studentRoute");
const parentRoute = require("./parentRoute");
const employeeRoute = require("./employeeRoute");
const roleRoute = require("./roleRoute");
const wasteTypeRoute = require("./wasteTypeRoute");
const subjectRoute = require("./subjectRoute");
const studentClassRoute = require("./studentClassRoute");
const studentAttendanceRoute = require("./studentAttendanceRoute");
const wasteCollectionRoute = require("./wasteCollectionRoute");
const userAccessRoute = require("./userAccessRoute");
const formTeacherRoute = require("./formTeacherRoute");
const eduCalendarRoute = require("./eduCalendarRoute");
const eduCalendarDetailRoute = require("./eduCalendarDetailRoute");
const bookCategoryRoute = require("./bookCategoryRoute");
const bookRoute = require("./bookRoute");
const borrowBookRoute = require("./borrowBookRoute");
const studentTaskRoute = require("./studentTaskRoute");
const messageRoute = require("./messageRoute");
const numberReportRoute = require("./numberReportRoute");
const narrativeCategoryRoute = require("./narrativeCategoryRoute");
const narrativeSubCategoryRoute = require("./narrativeSubCategoryRoute");
const narrativeReportRoute = require("./narrativeReportRoute");
const timetableTempRoute = require("./timetableTempRoute");
const classTimetableRoute = require("./classTimetableRoute");
const bookSliderRoute = require("./bookSliderRoute");
const monthRoute = require("./monthRoute");
const paymentPostRoute = require("./paymentPostRoute");
const paymentCategoryRoute = require("./paymentCategoryRoute");
const monthlyRoute = require("./monthlyRoute");
const timetableRoute = require("./timetableRoute");
const timetableDetailRoute = require("./timetableDetailRoute");
const taskCategoryRoute = require("./taskCategoryRoute");
const financialPostRoute = require("./FinancialPostRoute");
const transactionJournalRoute = require("./transactionJournalRoute");
const personalityRoute = require("./personalityRoute");
const studentPersonalityRoute = require("./studentPersonalityRoute");
const narrativeDescRoute = require("./narrativeDescRoute");
const userChatRoute = require("./userChatRoute");
const narrativeCommentRoute = require("./narrativeCommentRoute");
const bookReviewRoute = require("./bookReviewRoute");
const nonMonthlyRoute = require("./nonMonthlyRoute");
const announcementRoute = require("./announcementRoute");
const achievementRoute = require("./achievementRoute");
const userRoute = require("./userRoute");
const studentReportRoute = require("./studentReportRoute");
const reportSignerRoute = require("./reportSignerRoute");
const portofolioReportRoute = require("./portofolioReportRoute");
const forCountryRoute = require("./forCountryRoute");
const forCountryDetailRoute = require("./forCountryDetailRoute");
const overviewRoute = require("./overviewRoute");
const taskRoute = require("./taskRoute");
const taskDetailRoute = require("./taskDetailRoute");
const templatesRoute = require("./templatesRoute");
const notificationRoute = require("./notificationRoute");
const studentDataRoute = require("./studentDataRoute")
const studentPaymentPostRoute = require("./studentPaymentPostRoute")
const studentPaymentCategoryRoute = require("./studentPaymentCategoryRoute")
const studentPaymentBillsRoute = require("./studentPaymentBillsRoute")
const studentBillsRoute = require("./studentBillsRoute")
const studentArrearsRoute = require("./studentArrearsRoute")
const studentPaymentReportRoute = require("./studentPaymentReportRoute")
const wasteOfficerRoute = require("./wasteOfficerRoute")
const wasteSalesRoute = require("./wasteSalesRoute")
const dashboardRoute = require("./DashboardRoute")

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/academic-year",
    route: academicYearRoute,
  },
  {
    path: "/classes",
    route: classesRoute,
  },
  {
    path: "/religion",
    route: religionRoute,
  },
  {
    path: "/student",
    route: studentRoute,
  },
  {
    path: "/parent",
    route: parentRoute,
  },
  {
    path: "/employee",
    route: employeeRoute,
  },
  {
    path: "/role",
    route: roleRoute,
  },
  {
    path: "/waste-type",
    route: wasteTypeRoute,
  },
  {
    path: "/subject",
    route: subjectRoute,
  },
  {
    path: "/student-class",
    route: studentClassRoute,
  },
  {
    path: "/student-attendance",
    route: studentAttendanceRoute,
  },
  {
    path: "/waste-collection",
    route: wasteCollectionRoute,
  },
  {
    path: "/user-access",
    route: userAccessRoute,
  },
  {
    path: "/form-teacher",
    route: formTeacherRoute,
  },
  {
    path: "/edu-calendar",
    route: eduCalendarRoute,
  },
  {
    path: "/edu-calendar-detail",
    route: eduCalendarDetailRoute,
  },
  {
    path: "/book-category",
    route: bookCategoryRoute,
  },
  {
    path: "/book",
    route: bookRoute,
  },
  {
    path: "/borrow-book",
    route: borrowBookRoute,
  },
  {
    path: "/student-task",
    route: studentTaskRoute,
  },
  {
    path: "/message",
    route: messageRoute,
  },
  {
    path: "/number-report",
    route: numberReportRoute,
  },
  {
    path: "/narrative-category",
    route: narrativeCategoryRoute,
  },
  {
    path: "/narrative-sub-category",
    route: narrativeSubCategoryRoute,
  },
  {
    path: "/narrative-report",
    route: narrativeReportRoute,
  },
  {
    path: "/timetable-temp",
    route: timetableTempRoute,
  },
  {
    path: "/class-timetable",
    route: classTimetableRoute,
  },
  {
    path: "/book-slider",
    route: bookSliderRoute,
  },
  {
    path: "/month",
    route: monthRoute,
  },
  {
    path: "/payment-post",
    route: paymentPostRoute,
  },
  {
    path: "/payment-category",
    route: paymentCategoryRoute,
  },
  {
    path: "/monthly",
    route: monthlyRoute,
  },
  {
    path: "/timetable",
    route: timetableRoute,
  },
  {
    path: "/timetable-detail",
    route: timetableDetailRoute,
  },
  {
    path: "/task-category",
    route: taskCategoryRoute,
  },
  {
    path: "/financial-post",
    route: financialPostRoute,
  },
  {
    path: "/transaction-journal",
    route: transactionJournalRoute,
  },
  {
    path: "/personality",
    route: personalityRoute,
  },
  {
    path: "/student-personality",
    route: studentPersonalityRoute,
  },
  {
    path: "/narrative-desc",
    route: narrativeDescRoute,
  },
  {
    path: "/user-chat",
    route: userChatRoute,
  },
  {
    path: "/narrative-comment",
    route: narrativeCommentRoute,
  },
  {
    path: "/book-review",
    route: bookReviewRoute,
  },
  {
    path: "/non-monthly",
    route: nonMonthlyRoute,
  },
  {
    path: "/announcement",
    route: announcementRoute,
  },
  {
    path: "/achievement",
    route: achievementRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/student-report",
    route: studentReportRoute,
  },
  {
    path: "/report-signer",
    route: reportSignerRoute,
  },
  {
    path: "/portofolio-report",
    route: portofolioReportRoute,
  },
  {
    path: "/for-country",
    route: forCountryRoute,
  },
  {
    path: "/for-country-detail",
    route: forCountryDetailRoute,
  },
  {
    path: "/overview",
    route: overviewRoute,
  },
  {
    path: "/task",
    route: taskRoute,
  },
  {
    path: "/task-detail",
    route: taskDetailRoute,
  },
  {
    path: "/template",
    route: templatesRoute,
  },
  {
    path: "/notification",
    route: notificationRoute,
  },
  {
    path: "/student-data",
    route: studentDataRoute,
  },
  {
    path: "/student-payment-post",
    route: studentPaymentPostRoute,
  },
  {
    path: "/student-payment-category",
    route: studentPaymentCategoryRoute,
  },
  {
    path: "/student-payment-bills",
    route: studentPaymentBillsRoute
  },
  {
    path: "/student-bills",
    route: studentBillsRoute
  },
  {
    path: "/student-arrears",
    route: studentArrearsRoute
  },
  {
    path: "/student-payment-report",
    route: studentPaymentReportRoute
  },
  {
    path: "/waste-officer",
    route: wasteOfficerRoute
  },
  {
    path: "/waste-sales",
    route: wasteSalesRoute
  },
  {
    path: "/dashboard",
    route: dashboardRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
