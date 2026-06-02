const mongoose = require("mongoose");
const productCategorySchema = new mongoose.Schema(
  {
    companyId: { type: String },
    brandId: { type: String },
    categoryTitle: { type: String, trim: true },
    categoryParentId: { type: String },
    categoryLogo: { type: String },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("ProductCategory", productCategorySchema);
