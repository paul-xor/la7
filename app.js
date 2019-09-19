// const app = require("./app");
const express = require("express");
const app = express();

const dotenv = require("dotenv");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const path = require("path");
const router = express.Router();
const sendEmail = require("./utils/email");

dotenv.config({ path: "./config.env" });

//ROUTES.
router.get("/", function(req, res) {
  res.render("index.ejs");
});
router.get("/about", function(req, res) {
  res.render("about.ejs");
});
router.get("/services", function(req, res) {
  res.render("services.ejs");
});
// MIDDLEWARE.
app.set("view engine", "ejs");
app.use("/", router);
app.use(express.static(path.join(__dirname, "public")));

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

// SERVER.
const port = 7777;
app.listen(port, () => {
  console.log(`Server running on PORT:${port} ...`);
});
