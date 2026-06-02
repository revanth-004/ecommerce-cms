const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    companyId: { type: String },
    brandName: { type: String, trim: true },
    brandEmail: { type: String, unique: true, lowercase: true },
    brandMobileCountryCode: { type: String },
    brandMobile: { type: String, unique: true, trim: true },
    brandWebsite: { type: String, trim: true },
    brandGST: { type: String, uppercase: true, trim: true },
    brandZipcode: { type: String },
    brandCountry: { type: String },
    brandState: { type: String },
    brandDistrict: { type: String },
    brandCity: { type: String },
    brandAddress: { type: String },
    brandLogo: { type: String },
    communicationEmails: { type: [String] },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Brand", brandSchema);
