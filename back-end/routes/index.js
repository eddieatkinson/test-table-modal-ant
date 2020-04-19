var express = require("express");
var router = express.Router();
const config = require("../config/config");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

router.get("/app/config", (req, res) => {
  res.json(config);
});

module.exports = router;
