// const app = require("./app");
const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();

//ROUTES.
router.get("/", function(req, res) {
  res.render("index.ejs");
});

// MIDDLEWARE.
app.set("view engine", "ejs");
app.use("/", router);
app.use(express.static(path.join(__dirname, "public")));

// SERVER.
const port = 7777;
app.listen(port, () => {
  console.log(`Server running on PORT:${port} ...`);
});
