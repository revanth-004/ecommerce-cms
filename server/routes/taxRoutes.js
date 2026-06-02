const express = require("express");
const router = express.Router();
const Tax = require("../models/Tax");

const {
  addTax,
  getTaxes,
  getTaxById,
  deleteTax,
  putTax,
} = require("../controllers/TaxController");

router.post("/", addTax);
router.get("/", getTaxes);
router.get("/:id", getTaxById);
router.delete("/:id", deleteTax);
router.put("/:id", putTax);

module.exports = router;
