export const validate = (data) => {
  const errors = {};
  const required = [
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
  ];
  required.forEach((field) => {
    if (!data[field] || String(data[field]).trim() === "")
      errors[field] = "This field is required";
  });
  ["companyMobile", "adminMobile", "companyZipcode"].forEach((field) => {
    if (data[field] && !/^\d+$/.test(data[field]))
      errors[field] = "This field must be numeric";
  });
  if (data.companyMobile?.length !== 10)
    errors.companyMobile = "Mobile number should have 10 digits";
  if (data.adminMobile?.length !== 10)
    errors.adminMobile = "Mobile number should have 10 digits";
  if (data.adminPassword?.length < 8)
    errors.adminPassword = "Password should have at least 8 characters";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.companyEmail && !emailRegex.test(data.companyEmail))
    errors.companyEmail = "Invalid email format";
  if (data.adminEmail && !emailRegex.test(data.adminEmail))
    errors.adminEmail = "Invalid email format";
  return true;
};
