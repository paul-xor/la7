const nodemailer = require("nodemailer");

const sendEmail = async options => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // 2) Define the email options
  const mailOptions = {
    from: "Nodemailer Contact",
    to: "Pasha <pasha.a.smolov@gmail.com>",
    subject: "Node Contact Request",
    // text: options.message
    html: output //html body
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log("Message sent: %s", data.messageId);
      res.render("contact", { msg: "Email has been sent" });
    }
  });
};

module.exports = sendEmail;
