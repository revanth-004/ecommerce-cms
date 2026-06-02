const mongoose = require("mongoose");

const specificationDetailsSchema = new mongoose.Schema({
  specificationId: { type: String },
  specificationDetailId: { type: String },
});

const productSpecificationsSchema = new mongoose.Schema({
  specifications: [specificationDetailsSchema],
  productSellingPrice: { type: Number },
  productPrice: { type: Number },
  tax: { type: String },
  hsn: { type: String },
  productMedia: { type: [String], default: [] },
  defaultMedia: { type: String },
  productStock: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

const productSellerSchema = new mongoose.Schema({
  sellerId: { type: String },
  sellerMedia: { type: [String], default: [] },
  defaultMedia: { type: String },
  alterName: { type: [String], default: [] },
});

const productSEOSchema = new mongoose.Schema({
  metaKeyword: { type: String },
  metaDescription: { type: String },
  h1: { type: String },
  h2: { type: String },
  h3: { type: String },
  h4: { type: String },
});

const productMeasurementsSchema = new mongoose.Schema({
  length: { type: Number },
  width: { type: Number },
  height: { type: Number },
  breadth: { type: Number },
});

const productDetailSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },

    productSpecifications: [productSpecificationsSchema],

    productSeller: productSellerSchema,
    productSEO: productSEOSchema,
    productMeasurements: productMeasurementsSchema,
    productTags: { type: [String], default: [] },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("ProductDetail", productDetailSchema);
