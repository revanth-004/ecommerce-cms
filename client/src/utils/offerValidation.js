export const validate = (data) => {
  const errors = {};
  const required = [
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
  ];
  required.forEach((field) => {
    if (!data[field] || String(data[field]).trim() === "")
      errors[field] = "This field is required";
  });
  //   ["sellerMobile", "sellerZipcode"].forEach((field) => {
  //     if (data[field] && !/^\d+$/.test(data[field]))
  //       errors[field] = "This field must be numeric";
  //   });
  //   if (data.sellerMobile?.length !== 10)
  //     errors.sellerMobile = "Mobile number should have 10 digits";
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (data.sellerEmail && !emailRegex.test(data.sellerEmail))
  //     errors.sellerEmail = "Invalid email format";
  return true;
};
