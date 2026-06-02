const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

const {
  postProduct,
  getProducts,
  getProductById,
  deleteProduct,
  putProduct,
} = require("../controllers/productController");

router.post("/", postProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);
router.put("/:id", putProduct);

module.exports = router;
