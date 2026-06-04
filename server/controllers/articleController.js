const Article = require("../models/Article");
const apiResponse = require("../utils/apiResponse");

exports.postArticles = async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    await newArticle.save();
    return apiResponse(res).created(newArticle, "Article created successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getArticles = async (req, res) => {
  try {
    const { companyId, brandId, ids } = req.query;
    const filter = {};
    if (companyId) filter.companyId = companyId;
    if (brandId) filter.brandId = brandId;

    if (ids) {
      const idArray = ids.split(",");
      filter._id = { $in: idArray };
    }

    const articles = await Article.find(filter);
    return apiResponse(res).success(articles, "Articels fetched successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return apiResponse(res).notFound("Article not found");
    return apiResponse(res).success(article, "Article fetched successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return apiResponse(res).notFound("Article not found");
    return apiResponse(res).success(null, "Article deleted successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.putArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!article) return apiResponse(res).notFound("Article not found");
    return apiResponse(res).success(article, "Article updated successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};
