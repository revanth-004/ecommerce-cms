const Category = require("../models/ArticleCategory");
const apiResponse = require("../utils/apiResponse");

exports.postArticleCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    return apiResponse(res).created(
      newCategory,
      "Category created successfully",
    );
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getArticleCategories = async (req, res) => {
  try {
    const { companyId, brandId, ids } = req.query;
    const filter = {};
    if (companyId) filter.companyId = companyId;
    if (brandId) filter.brandId = brandId;
    if (ids) {
      const idArray = ids.split(",");
      filter._id = { $in: idArray };
    }
    const categories = await Category.find(filter);
    return apiResponse(res).success(
      categories,
      "Categories fetched successfully",
    );
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getArticleCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return apiResponse(res).notFound("Category not found");
    return apiResponse(res).success(category, "Category fetched successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.deleteArticleCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return apiResponse(res).notFound("Category not found");
    return apiResponse(res).success(null, "Category deleted successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.putArticleCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) return apiResponse(res).notFound("Category not found");
    return apiResponse(res).success(category, "Category updated successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};
