const util = require("util");
const multer = require("multer");
const path = require("node:path");
const fs = require("fs");

const dir = "./files/signatures/";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Helper function to save Base64 data to a file
const saveBase64File = (base64String, filePath) => {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, ''); // Remove metadata prefix
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(filePath, buffer); // Save the file
};

// Modified Multer storage to handle Base64 or regular file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir); // directory for saving file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_task" + path.extname(file.originalname)); // append file extension
  },
});

const fileFilter = function (req, file, cb) {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Please upload only image file."), false);
  }
};

// Middleware to handle Base64 or file uploads
const uploadFile = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // Max file size 5MB
  fileFilter: fileFilter,
}).single("signature_image");

// Promisify the upload middleware for async/await usage
let uploadFileMiddleware = util.promisify(uploadFile);

module.exports = async (req, res, next) => {
  // Check if Base64 data is sent instead of a file
  if (req.body.signature_image && req.body.signature_image.startsWith("data:image/")) {
    const filePath = path.join(dir, Date.now() + "_task.png"); // Choose the file name and extension

    // Decode Base64 and save the file
    saveBase64File(req.body.signature_image, filePath);

    // Attach the file details to the request object for further use
    req.file = {
      path: filePath,
      originalname: "signature_image.png",
      mimetype: "image/png",
      size: fs.statSync(filePath).size, // get the file size
    };

    next();
  } else {
    // If not Base64, proceed with Multer's normal behavior
    try {
      await uploadFileMiddleware(req, res);
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      next();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};
