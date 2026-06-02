const mongoose = require("mongoose");

const taxSchema = new mongoose.Schema(
  {
    companyId: { type: String },
    taxName: { type: String, trim: true },
    taxValue: { type: String },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Tax", taxSchema);
