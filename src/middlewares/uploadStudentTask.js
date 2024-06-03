const util = require("util");
const multer = require("multer");
const path = require("node:path");

const fs = require("fs");

const dir = "./files/tasks/";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

//storage for image upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // console.log(file.originalname);
    cb(null, Date.now() + "_task" + path.extname(file.originalname)); //Appending extension
  },
});

//file filter for extention
var fileFilter = function (req, file, cb) {
  // console.log(file.mimetype);
  const allowedMimes = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/pdf",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb("Please upload only pdf or word document file.", false);
  }
};

//upload for to pass storage, file size limit and filter
//maximum file size is 1Mb
const uploadFile = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
  fileFilter: fileFilter,
}).single("down_file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
