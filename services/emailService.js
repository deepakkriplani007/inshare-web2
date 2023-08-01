const nodemailer = require("nodemailer");

// function
async function sendMail({ from, to, subject, text, html }) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  //   // verify connection configuration
  //   transporter.verify(function (error, success) {
  //     if (error) {
  //     //   console.log("fufajfsl sfjalsfajfsl jlkfasf ");
  //       console.log(error);
  //     } else {
  //       console.log("Server is ready to take our messages");
  //     }
  //   });

  let info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  //   console.log(info);
}

module.exports = sendMail;
