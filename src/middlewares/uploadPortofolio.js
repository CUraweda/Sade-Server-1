const util = require('util');
const multer = require('multer');
const path = require('node:path');

const fs = require('fs');

const dir = './files/portofolio_reports/';

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// storage for image upload
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, dir);
    },
    filename(req, file, cb) {
        // console.log(file.originalname);
        cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
    },
});

// file filter for extention
const fileFilter = (req, file, cb) => {
    // console.log(file.mimetype);
    const allowedMimes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb('Please upload only pdf and image file.', false);
    }
};

// upload for to pass storage, file size limit and filter
// maximum file size is 1Mb
const uploadFile = multer({
    storage,
    limits: { fileSize: 5000000 },
    fileFilter,
}).single('file');

const uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
