const express = require("express");
const router = express.Router();
const Category = require("../models/ArticleCategory");

const {
  postArticleCategory,
  getArticleCategories,
  getArticleCategoryById,
  deleteArticleCategory,
  putArticleCategory,
} = require("../controllers/articleCategoryController");

router.post("/", postArticleCategory);
router.get("/", getArticleCategories);
router.get("/:id", getArticleCategoryById);
router.delete("/:id", deleteArticleCategory);
router.put("/:id", putArticleCategory);

module.exports = router;
