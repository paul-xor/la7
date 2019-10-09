const nodemailer = require("nodemailer");
const mailGun = require("nodemailer-mailgun-transport");

const auth = {
  auth: {
    api_key: process.env.API_KEY || "GUNMAIL_API_KEY", // TODO: Replace with your mailgun API KEY
    domain: process.env.DOMAIN || "GUNMAIL_DOMAIN" // TODO: Replace with your mailgun" // TODO: Replace with your mailgun DOMAIN
  }
};

const transporter = nodemailer.createTransport(mailGun(auth));

const sendMail = async options => {
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

  // 2) Define the email options
  const mailOptions = {
    from: "Nodemailer Contact",
    to: "Pasha <welcome@la7digital.com>",
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

module.exports = sendMail;
