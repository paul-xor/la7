// const app = require("./app");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const nodemailer = require("nodemailer");
const expbs = require("express-handlebars");
const mailGun = require("nodemailer-mailgun-transport");

const dotenv = require("dotenv");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const path = require("path");
const router = express.Router();
const compression = require("compression");

dotenv.config({ path: "./config.env" });

//ROUTES.
router.get("/", function(req, res) {
  res.render("index", { msg: "something ...", isDisplay: false });
});

// MIDDLEWARE.
app.engine("handlebars", expbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use("/", router);
app.use(express.static(path.join(__dirname, "public")));
// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());

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

  const auth = {
    auth: {
      api_key: process.env.API_KEY || "GUNMAIL_API_KEY", // TODO: Replace with your mailgun API KEY
      domain: process.env.DOMAIN || "GUNMAIL_DOMAIN" // TODO: Replace with your mailgun" // TODO: Replace with your mailgun DOMAIN
    }
  };

  const transporter = nodemailer.createTransport(mailGun(auth));

  const mailOptions = {
    from: `${req.body.email}`,
    to: "welcome@la7digital.com",
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

    res.render("index", {
      msg: "Email has been sent",
      isDisplay: true
    });
  });
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

//keep awake
const http = require("http");
setInterval(function() {
  http.get("http://la7.herokuapp.com");
}, 300000); // every 5 minutes (300000)

// SERVER.
const port = process.env.PORT || 7777;
app.listen(port, () => {
  console.log(`Server running on PORT:${port} ...`);
});
