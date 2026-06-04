const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    companyId: { type: String },
    brandId: { type: String },
    offerName: { type: String },
    offerBanner: { type: String },
    offerValue: { type: String },
    offerMethod: { type: String },
    offerValidity: {
      from: { type: String },
      to: { type: String },
    },
    offerCategory: { type: String },
    offerTo: { type: [String] },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Offer", offerSchema);
