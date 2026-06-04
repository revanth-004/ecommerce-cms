export const validate = (data) => {
  const errors = {};
  const required = [
    //Common
    "brandId",

    //Company
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

    //Brand
    "brandName",
    "brandEmail",
    "brandMobileCountryCode",
    "brandMobile",
    "brandCountry",
    "brandState",
    "brandDistrict",

    //Seller
    "sellerName",
    "sellerEmail",
    "sellerMobileCountryCode",
    "sellerMobile",
    "sellerCountry",
    "sellerState",
    "sellerDistrict",

    //Customer
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

    //Product

    //Offer
    // "brandId",
    "offerName",
    "offerBanner",
    "offerValue",
    "offerMethod",
    "offerCategory",

    //Coupon
    // "brandId",
    "couponName",
    "couponDescription",
    "couponCode",
    "couponValue",
    "couponMethod",
    "couponCategory",

    //Article
    // "brandId",
    "articleTitle",
    "articleContent",

    //Product Category
    // "brandId",
    "categoryTitle",
    "categoryLogo",

    //Tax
    "taxName",
    "taxValue",

    //HSN
    "hsnName",
    "hsnCode",

    //Specification
    // "brandId",
    "specificationName",

    //Specifictaion Detail
    // "brandId",
    "specificationId",
    "specificationDetial",
  ];

  const digits = ["companyZipcode"];

  const phones = ["companyMobile", "adminMobile"];

  const emails = [];

  const passwords=[]

  //Check Required Fields
  required.forEach((field) => {
    if (!data[field] || String(data[field]).trim() === "")
      errors[field] = "This field is required";
  });

  //Check Numeric Value
  digits.forEach((field) => {
    if (data[field] && !/^\d+$/.test(data[field]))
      errors[field] = "This field must be numeric";
  });

  //Check Phone Value
  phones.forEach((field) => {
    if (data[field] && !/^\d+$/.test(data[field])) {
      errors[field] = "This field must be numeric";
    } else if (data.field?.length !== 10) {
      errors.field = "Mobile number should have 10 digits";
    }
  });

  //Check Mail Format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  emails.forEach((field) => {
    if (data.field && !emailRegex.test(data.field))
      errors.field = "Invalid email format";
  });

  //Check Password
  passwords.forEach((field) => {
    if (data.field?.length < 8)
      errors.field = "Password should have at least 8 characters";
  });

  return errors;
};
