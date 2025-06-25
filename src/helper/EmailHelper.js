/* eslint-disable class-methods-use-this */

const config = require("../config/config");
const logger = require("../config/logger");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  host: "srv170.niagahoster.com", // SMTP host
  port: 465, // SMTP port
  secure: true, // Use SSL
  auth: {
    user: "no-reply@curaweda.com",
    pass: "CurawedaPalagan125@"
  }
});


var readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

class EmailHelper {
  async sendEmail(
    webUrl,
    from,
    to,
    subject,
    body,
    auth = null,
    attachment = false
  ) {
    try {
      readHTMLFile(body, function (err, html) {
        if (err) {
          console.log("error reading file", err);
          return;
        }
        var template = handlebars.compile(html);
        var replacements = {
          url: webUrl,
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
          from: from,
          to: to,
          subject: subject,
          html: htmlToSend,
        };
        transporter.sendMail(mailOptions, function (error, response) {
          if (error) {
            console.log(error);
          }
        });
      });
    } catch (err) {
      console.log(err);
      logger.error(err);
      return false;
    }
  }
}

module.exports = EmailHelper;
