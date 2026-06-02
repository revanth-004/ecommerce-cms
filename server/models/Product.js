const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    companyId: { type: String, required: true },
    brandId: { type: String, required: true },
    productName: { type: String, required: true },
    productCategoryId: { type: String, required: true },
    productDescription: { type: String, required: true },

    productDetailId: { type: String },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", productSchema);
