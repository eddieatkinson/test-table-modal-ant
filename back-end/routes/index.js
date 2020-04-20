var express = require("express");
var router = express.Router();
const lodash = require("lodash");
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

router.post("/processpayment", (req, res) => {
  const { key, amountDue, invoices } = req.body;
  const invoiceElementToAdjust = lodash.findIndex(invoices, { invoiceId: key });
  const invoiceToAdjust = invoices[invoiceElementToAdjust];
  invoiceToAdjust.amountDue = amountDue;
  invoices.splice(invoiceElementToAdjust, 1, invoiceToAdjust);
  fs.writeFile(
    __dirname + "/public/invoices.json",
    JSON.stringify(invoices),
    (error) => {
      if (error) {
        throw error;
      }
      res.json({ msg: "replaced" });
    }
  );
});

router.post("/processcredit", (req, res) => {
  const { vendors, vendorId, creditBal } = req.body;
  const vendorElementToAdjust = lodash.findIndex(vendors, { vendorId });
  const vendorToAdjust = vendors[vendorElementToAdjust];
  vendorToAdjust.creditBal = creditBal;
  vendors.splice(vendorElementToAdjust, 1, vendorToAdjust);
  fs.writeFile(
    __dirname + "/public/vendors.json",
    JSON.stringify(vendors),
    (error) => {
      if (error) {
        throw error;
      }
      res.json({ msg: "replaced" });
    }
  );
});

module.exports = router;
