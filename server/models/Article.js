const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    companyId: { type: String },
    brandId: { type: String },
    articleCategoryId: { type: String },
    articleTitle: { type: String, trim: true },
    articleBanner: { type: String },
    articleContent: { type: String },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Article", articleSchema);
