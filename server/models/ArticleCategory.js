const mongoose = require("mongoose");
const articleCategorySchema = new mongoose.Schema(
  {
    companyId: { type: String },
    brandId: { type: String },
    articleCategoryTitle: { type: String, trim: true },
    articleCategoryParentId: { type: String },
    articleCategoryLogo: { type: String },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("ArticleCategory", articleCategorySchema);
