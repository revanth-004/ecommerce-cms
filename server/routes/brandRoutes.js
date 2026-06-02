const express = require("express");
const router = express.Router();
const Brand = require("../models/Brand");

const {
  addBrand,
  getBrands,
  getBrandById,
  deleteBrand,
  putBrand,
} = require("../controllers/brandController");

router.post("/", addBrand);
router.get("/", getBrands);
router.get("/:id", getBrandById);
router.delete("/:id", deleteBrand);
router.put("/:id", putBrand);

module.exports = router;
