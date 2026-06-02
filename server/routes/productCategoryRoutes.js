const express = require("express");
const router = express.Router();
const Category = require("../models/ProductCategory");

const {
  postCategory,
  getCategories,
  getCategoryById,
  deleteCategory,
  putCategory,
} = require("../controllers/productCategoryController");

router.post("/", postCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.delete("/:id", deleteCategory);
router.put("/:id", putCategory);

module.exports = router;
