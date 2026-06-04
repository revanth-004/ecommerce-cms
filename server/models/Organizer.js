const mongoose = require("mongoose");
const organizerSchema = new mongoose.Schema(
  {
    companyName: { type: String, trim: true },
    companyEmail: { type: String, unique: true, lowercase: true },
    companyMobileCountryCode: { type: String },
    companyMobile: { type: String, trim: true },
    companyWebsite: { type: String, trim: true },
    companyGST: { type: String, uppercase: true, trim: true },
    companyZipcode: { type: String },
    companyCountry: { type: String },
    companyState: { type: String },
    companyDistrict: { type: String },
    companyCity: { type: String },
    companyAddress: { type: String },
    companyLogo: { type: String },
    adminName: { type: String },
    adminEmail: { type: String, unique: true, lowercase: true },
    adminMobileCountryCode: { type: String },
    adminMobile: { type: String },
    adminPassword: { type: String },
    communicationEmails: { type: [String] },
    projectModules: { type: [String] },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Organizer", organizerSchema);
