const mongoose = require("mongoose");

const specificationDetailSchema = new mongoose.Schema(
  {
    companyId: { type: String },
    brandId: { type: String },
    specificationId: { type: String },
    specificationDetail: { type: String, trim: true },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "SpecificationDetail",
  specificationDetailSchema,
);
