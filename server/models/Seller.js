const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    companyId: { type: String },
    sellerName: { type: String, trim: true },
    sellerEmail: { type: String, unique: true, lowercase: true },
    sellerMobileCountryCode: { type: String },
    sellerMobile: { type: String, unique: true, trim: true },
    sellerWebsite: { type: String, trim: true },
    sellerGST: { type: String, uppercase: true, trim: true },
    sellerZipcode: { type: String },
    sellerCountry: { type: String },
    sellerState: { type: String },
    sellerDistrict: { type: String },
    sellerCity: { type: String },
    sellerAddress: { type: String },
    sellerLogo: { type: String },
    communicationEmails: { type: [String] },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Seller", sellerSchema);
