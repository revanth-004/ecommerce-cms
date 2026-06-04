const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    companyId: { type: String },
    brandId: { type: String },
    couponName: { type: String },
    couponDescription: { type: String },
    couponCode: { type: String },
    couponBanner: { type: String },
    couponValue: { type: String },
    couponMethod: { type: String },
    couponValidity: {
      from: { type: String },
      to: { type: String },
    },
    couponCategory: { type: String },
    couponToCustomers: { type: [String] },
    couponValueGreaterThan: { type: String },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Coupon", couponSchema);
