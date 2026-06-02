const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema(
  {
    companyId: { type: String, required: true },
    brandId: { type: String, required: true },
    customerFirstName: { type: String, trim: true },
    customerLastName: { type: String, trim: true },
    customerEmail: { type: String, lowercase: true },
    customerMobileCountryCode: { type: String },
    customerMobile: { type: String, trim: true },
    customerShippingAddressLine1: { type: String },
    customerShippingAddressLine2: { type: String },
    customerBillingAddressLine1: { type: String },
    customerBillingAddressLine2: { type: String },
    customerLandmark: { type: String },
    customerDateOfBirth: { type: String },
    customerCountry: { type: String },
    customerState: { type: String },
    customerDistrict: { type: String },
    customerCity: { type: String },
    customerZipcode: { type: String },
    customerGST: { type: String, uppercase: true, trim: true },
    addedFrom: { type: String },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Customer", customerSchema);
