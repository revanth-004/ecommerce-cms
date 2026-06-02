export const validate = (data) => {
  const errors = {};
  const required = [
    "brandName",
    "brandEmail",
    "brandMobileCountryCode",
    "brandMobile",
    "brandCountry",
    "brandState",
    "brandDistrict",
  ];
  required.forEach((field) => {
    if (!data[field] || String(data[field]).trim() === "")
      errors[field] = "This field is required";
  });
  ["brandMobile", "brandZipcode"].forEach((field) => {
    if (data[field] && !/^\d+$/.test(data[field]))
      errors[field] = "This field must be numeric";
  });
  if (data.brandMobile?.length !== 10)
    errors.brandMobile = "Mobile number should have 10 digits";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.brandEmail && !emailRegex.test(data.brandEmail))
    errors.brandEmail = "Invalid email format";
  return true;
};
