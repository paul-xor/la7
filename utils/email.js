const nodemailer = require("nodemailer");

const sendEmail = async options => {
  // 1) Create a transporter
  const output = `
    <p>You have a new contact request.</p>
    <h3>Contact Details:</h3>
    <ul>
      <li>name: ${req.body.name}</li>
      <li>company: ${req.body.company}</li>
      <li>email: ${req.body.email}</li>
      <li>phone: ${req.body.phone}</li>
    </ul>
    <h3>Message:</h3>
    <p>${req.body.message}</p>
  `;

  const transporter = nodemailer.createTransport({
    service: "gmail",
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
    subject: `LA7digital Contact Request - ${req.body.name} - ${req.body.company}`,
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
