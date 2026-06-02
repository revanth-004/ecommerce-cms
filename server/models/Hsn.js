const mongoose = require("mongoose");

const hsnSchema = new mongoose.Schema(
  {
    companyId: { type: String },
    hsnName: { type: String, trim: true },
    hsnCode: { type: String },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Hsn", hsnSchema);
