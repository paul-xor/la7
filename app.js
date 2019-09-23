// const app = require("./app");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const nodemailer = require("nodemailer");

const dotenv = require("dotenv");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const path = require("path");
const router = express.Router();
// const sendEmail = require("./utils/email");

dotenv.config({ path: "./config.env" });

//ROUTES.
router.get("/", function(req, res) {
  res.render("index.ejs");
});

// MIDDLEWARE.
app.set("view engine", "ejs");
app.use("/", router);
app.use(express.static(path.join(__dirname, "public")));
// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/email", (req, res) => {
  // console.log("Data:", req.body);

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
    // host: process.env.EMAIL_HOST,
    // port: process.env.EMAIL_PORT,
    // secure: false,
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: "Nodemailer Contact",
    to: "Pasha <pasha.a.smolov@gmail.com>",
    subject: `LA7digital Contact Request - ${req.body.name} - ${req.body.company}`,
    // text: options.message
    html: output //html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.render("index", { msg: "Email has been sent" });
  });
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

// SERVER.
const port = 7771;
app.listen(port, () => {
  console.log(`Server running on PORT:${port} ...`);
});
