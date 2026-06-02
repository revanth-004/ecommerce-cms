import React, { useState } from "react";
import { Country, State, City } from "country-state-city";
import FormCard from "./form-ui/FormCard";
import InputField from "./input/InputField";
import TextArea from "./input/TextArea";
import FileInput from "./input/FileInput";
import SelectInput from "./input/SelectInput";
import { Image } from "antd";

const CompanyForm = ({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  logoFile,
  setLogoFile,
  onSubmit,
  onCancel,
  submitLabel = "Submit",
}) => {
  const [currentEmail, setCurrentEmail] = useState("");

  const countries = Country.getAllCountries();
  const countrySelectOptions = countries.map((c) => ({
    value: c.isoCode,
    label: c.name,
  }));
  const countryCode = countries.map((c) => ({
    value: `+${c.phonecode}`,
    label: `${c.flag} +${c.phonecode} (${c.name})`,
  }));
  const states = formData.companyCountry
    ? State.getStatesOfCountry(formData.companyCountry)
    : [];
  const districts =
    formData.companyCountry && formData.companyState
      ? City.getCitiesOfState(formData.companyCountry, formData.companyState)
      : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      projectModules: checked
        ? [...prev.projectModules, value]
        : prev.projectModules.filter((m) => m !== value),
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      setFormErrors((prev) => ({ ...prev, companyLogo: "" }));
      setLogoFile(file);

      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  };

  const addEmail = (e) => {
    e.preventDefault();
    if (!currentEmail) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentEmail)) {
      alert("Please enter a valid email");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      communicationEmails: [...prev.communicationEmails, currentEmail],
    }));
    setCurrentEmail("");
  };

  const removeEmail = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      communicationEmails: prev.communicationEmails.filter(
        (_, i) => i !== indexToRemove,
      ),
    }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormCard title="Company Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Company Name"
            name="companyName"
            type="text"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Enter company name"
            error={formErrors.companyName}
            mandatory
          />
          <InputField
            label="Company Email"
            name="companyEmail"
            type="email"
            value={formData.companyEmail}
            onChange={handleChange}
            placeholder="Enter company email"
            error={formErrors.companyEmail}
            mandatory
          />
          <SelectInput
            label="Country Code"
            options={countryCode}
            value={
              countryCode.find(
                (o) => o.value === formData.companyMobileCountryCode,
              ) || null
            }
            onChange={(opt) =>
              setFormData((p) => ({
                ...p,
                companyMobileCountryCode: opt.value,
              }))
            }
            placeholder="Search country code..."
            error={formErrors.companyMobileCountryCode}
            mandatory
          />
          <InputField
            label="Company Mobile"
            name="companyMobile"
            type="tel"
            value={formData.companyMobile}
            onChange={handleChange}
            placeholder="Enter company mobile number"
            error={formErrors.companyMobile}
            mandatory
          />
          <InputField
            label="Company Website"
            name="companyWebsite"
            type="text"
            value={formData.companyWebsite}
            onChange={handleChange}
            placeholder="Enter company website"
          />
          <InputField
            label="GST Number"
            name="companyGST"
            type="text"
            value={formData.companyGST}
            onChange={handleChange}
            placeholder="Enter GST Number"
          />
          <InputField
            label="Zipcode"
            name="companyZipcode"
            type="text"
            value={formData.companyZipcode}
            onChange={handleChange}
            placeholder="Zipcode"
            error={formErrors.companyZipcode}
          />
          <SelectInput
            label="Country"
            options={countrySelectOptions}
            value={
              countrySelectOptions.find(
                (o) => o.value === formData.companyCountry,
              ) || null
            }
            onChange={(opt) =>
              setFormData((p) => ({
                ...p,
                companyCountry: opt.value,
                companyState: "",
                companyDistrict: "",
              }))
            }
            placeholder="Search country..."
            error={formErrors.companyCountry}
            mandatory
          />
          <SelectInput
            label="State"
            options={states.map((s) => ({ value: s.isoCode, label: s.name }))}
            value={
              states
                .map((s) => ({ value: s.isoCode, label: s.name }))
                .find((o) => o.value === formData.companyState) || null
            }
            onChange={(opt) =>
              setFormData((p) => ({
                ...p,
                companyState: opt.value,
                companyDistrict: "",
              }))
            }
            placeholder="Search state..."
            error={formErrors.companyState}
            mandatory
          />
          <SelectInput
            label="District"
            options={districts.map((d) => ({ value: d.name, label: d.name }))}
            value={
              districts
                .map((d) => ({ value: d.name, label: d.name }))
                .find((o) => o.value === formData.companyDistrict) || null
            }
            onChange={(opt) =>
              setFormData((p) => ({ ...p, companyDistrict: opt.value }))
            }
            placeholder="Search district..."
            error={formErrors.companyDistrict}
            mandatory
          />
          <TextArea
            label="Company Address"
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleChange}
            placeholder="Address"
            error={formErrors.companyAddress}
          />

          <div className="flex flex-col gap-1.5">
            <FileInput
              label="Company Logo"
              desc="(Recommended resolution: 120 × 40 px. Accepted formats: JPEG, PNG.)"
              name="companyLogo"
              onChange={handleLogoChange}
              error={formErrors.companyLogo}
              mandatory
            />

            {(logoFile || formData.companyLogo) && (
              <Image
                src={
                  logoFile
                    ? URL.createObjectURL(logoFile)
                    : `http://localhost:3000${formData.companyLogo}`
                }
                alt="Company Logo Preview"
                className="w-1/2 rounded-lg"
                
                width="50%"
              />
            )}
          </div>
        </div>
      </FormCard>

      <FormCard title="Admin Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Admin Name"
            name="adminName"
            type="text"
            value={formData.adminName}
            onChange={handleChange}
            error={formErrors.adminName}
            mandatory
          />
          <InputField
            label="Admin Email"
            name="adminEmail"
            type="text"
            value={formData.adminEmail}
            onChange={handleChange}
            error={formErrors.adminEmail}
            mandatory
          />
          <SelectInput
            label="Country Code"
            options={countryCode}
            value={
              countryCode.find(
                (o) => o.value === formData.adminMobileCountryCode,
              ) || null
            }
            onChange={(opt) =>
              setFormData((p) => ({ ...p, adminMobileCountryCode: opt.value }))
            }
            placeholder="Search country code..."
            error={formErrors.adminMobileCountryCode}
            mandatory
          />
          <InputField
            label="Admin Mobile"
            name="adminMobile"
            type="tel"
            value={formData.adminMobile}
            onChange={handleChange}
            placeholder="Mobile number"
            error={formErrors.adminMobile}
            mandatory
          />
          <InputField
            label="Password"
            name="adminPassword"
            type="password"
            value={formData.adminPassword}
            onChange={handleChange}
            error={formErrors.adminPassword}
            mandatory
          />
        </div>
      </FormCard>

      <FormCard title="Project Modules">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["HR", "Inventory", "CRM"].map((module) => (
            <div key={module} className="flex gap-4 items-center">
              <input
                type="checkbox"
                id={module}
                value={module}
                checked={formData.projectModules?.includes(module)}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 border-(--border-color) rounded"
              />
              <label
                htmlFor={module}
                className="text-sm text-(--text-secondary)"
              >
                {module}
              </label>
            </div>
          ))}
        </div>
      </FormCard>

      <FormCard title="Communication Emails">
        <div className="flex gap-4 items-center">
          <InputField
            name="emailInput"
            type="email"
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
            placeholder="example@company.com"
            className="w-64"
          />
          <button
            type="button"
            onClick={addEmail}
            className="px-6 py-2 text-white bg-blue-600 rounded-md font-semibold shadow-sm hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-1 p-2">
          {formData.communicationEmails?.map((email, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-(--bg-input)  border border-(--border-color) px-3 rounded-full text-sm"
            >
              <span className="text-(--text-primary)">{email}</span>
              <button
                type="button"
                onClick={() => removeEmail(index)}
                className="text-lg text-gray-400 hover:text-red-500 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </FormCard>

      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-white bg-(--color-primary) border border-(--border-color) rounded-md font-medium"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-(--color-primary) text-white border border-(--border-color) rounded-md font-medium shadow-sm"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default CompanyForm;
