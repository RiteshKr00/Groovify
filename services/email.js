const nodemailer = require("nodemailer");

// exports.option = (email, from, subject, htmlBody) => {
//   let mailOptions = {
//     to: email,
//     from: process.env.USER_EMAIL,
//     subject: subject,
//     body: htmlBody,
//   };
//   return mailOptions;
// };

const transporter = nodemailer.createTransport({
  host: process.env.HOST_SERVICE,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: "apikey",
    pass: process.env.USER_PASS,
  },
});

module.exports = { transporter };
