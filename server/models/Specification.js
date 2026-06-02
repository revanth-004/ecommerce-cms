const mongoose = require("mongoose");

const specificationSchema = new mongoose.Schema(
  {
    companyId: { type: String },
    brandId: { type: String },
    specificationName: { type: String, trim: true },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Specification", specificationSchema);
