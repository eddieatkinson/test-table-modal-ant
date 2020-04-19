var express = require("express");
var router = express.Router();
const config = require("../config/config");
const fs = require("fs");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

router.get("/app/config", (req, res) => {
  res.json(config);
});

router.get("/invoices", (req, res) => {
  fs.readFile(__dirname + "/public/invoices.json", "utf8", (error, data) => {
    res.json(data);
  });
});

router.get("/vendors", (req, res) => {
  fs.readFile(__dirname + "/public/vendors.json", "utf8", (error, data) => {
    res.json(data);
  });
});

module.exports = router;
