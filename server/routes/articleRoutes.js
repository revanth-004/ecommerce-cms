const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

const {
  postArticles,
  getArticles,
  getArticleById,
  deleteArticle,
  putArticle,
} = require("../controllers/articleController");

router.post("/", postArticles);
router.get("/", getArticles);
router.get("/:id", getArticleById);
router.delete("/:id", deleteArticle);
router.put("/:id", putArticle);

module.exports = router;
