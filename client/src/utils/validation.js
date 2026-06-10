const schemas = {
  seller: {
    required: [
      "sellerName",
      "sellerEmail",
      "sellerMobileCountryCode",
      "sellerMobile",
      "sellerCountry",
      "sellerState",
      "sellerDistrict",
    ],
    digits: [],
    phones: ["sellerMobile"],
    emails: ["sellerEmail"],
  },
  customer: {
    required: [
      "customerFirstName",
      "customerLastName",
      "customerEmail",
      "customerMobileCountryCode",
      "customerMobile",
      "customerShippingAddressLine1",
      "customerShippingAddressLine2",
      "customerBillingAddressLine1",
      "customerBillingAddressLine2",
      "customerLandmark",
      "customerDateOfBirth",
      "customerCountry",
      "customerState",
      "customerDistrict",
      "customerCity",
      "customerZipcode",
      "customerGST",
      "addedFrom",
    ],
    digits: ["customerZipcode"],
    phones: ["customerMobile"],
    emails: ["customerEmail"],
  },
  offer: {
    required: [
      "brandId",
      "offerName",
      "offerBanner",
      "offerValue",
      "offerMethod",
      "offerCategory",
    ],
    digits: ["offerValue"],
    phones: [],
    emails: [],
  },
  coupon: {
    required: [
      "brandId",
      "couponName",
      "couponDescription",
      "couponCode",
      "couponMethod",
      "couponCategory",
    ],
    digits: [],
    phones: [],
    emails: [],
  },
  article: {
    required: [
      "brandId",
      "articleCategoryId",
      "articleTitle",
      "articleContent",
    ],
    digits: [],
    phones: [],
    emails: [],
  },
  articleCategory: {
    required: ["brandId", "articleCategoryTitle", "articleCategoryLogo"],
    digits: [],
    phones: [],
    emails: [],
  },
  productCategory: {
    required: ["brandId", "categoryTitle", "categoryLogo"],
    digits: [],
    phones: [],
    emails: [],
  },
  tax: {
    required: ["taxName", "taxValue"],
    digits: [],
    phones: [],
    emails: [],
  },
  hsn: {
    required: ["hsnName", "hsnCode"],
    digits: [],
    phones: [],
    emails: [],
  },
  specification: {
    required: ["brandId", "specificationName"],
    digits: [],
    phones: [],
    emails: [],
  },
  specificationDetial: {
    required: ["brandId", "specificationId", "specificationDetial"],
    digits: [],
    phones: [],
    emails: [],
  },
  brand: {
    required: [
      "brandName",
      "brandEmail",
      "brandMobile",
      "brandMobileCountryCode",
      "brandCountry",
      "brandState",
      "brandDistrict",
    ],
    digits: [],
    phones: ["brandMobile"],
    emails: ["brandEmail"],
  },
  company: {
    required: [
      "companyName",
      "companyEmail",
      "companyMobileCountryCode",
      "companyMobile",
      "companyCountry",
      "companyState",
      "companyDistrict",
      "adminName",
      "adminEmail",
      "adminMobileCountryCode",
      "adminMobile",
      "adminPassword",
    ],
    digits: ["companyZipcode"],
    phones: ["companyMobile", "adminMobile"],
    emails: ["companyEmail", "adminEmail"],
    passwords: ["adminPassword"],
  },
};

export const validate = (formType, data) => {
  const schema = schemas[formType];
  if (!schema) return {};

  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  schema.required?.forEach((field) => {
    if (!data[field] || String(data[field]).trim() === "")
      errors[field] = "This field is required";
  });

  schema.digits?.forEach((field) => {
    if (data[field] && !/^\d+$/.test(data[field]))
      errors[field] = "Must be numeric";
  });

  schema.phones?.forEach((field) => {
    if (data[field] && !/^\d{10}$/.test(data[field]))
      errors[field] = "Must be a valid 10-digit number";
  });

  schema.emails?.forEach((field) => {
    if (data[field] && !emailRegex.test(data[field]))
      errors[field] = "Invalid email format";
  });

  schema.passwords?.forEach((field) => {
    if (data[field] && data[field].length < 8)
      errors[field] = "Password must be at least 8 characters";
  });

  return errors;
};
