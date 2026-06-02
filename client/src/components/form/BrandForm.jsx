import React, { useState } from "react";
import { Country, State, City } from "country-state-city";
import FormCard from "./form-ui/FormCard";
import InputField from "./input/InputField";
import TextArea from "./input/TextArea";
import FileInput from "./input/FileInput";
import SelectInput from "./input/SelectInput";

const BrandForm = ({
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
  const states = formData.brandCountry
    ? State.getStatesOfCountry(formData.brandCountry)
    : [];
  const districts =
    formData.brandCountry && formData.brandState
      ? City.getCitiesOfState(formData.brandCountry, formData.brandState)
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
      // if (img.width !== 120 || img.height !== 40) {
      //   setFormErrors((prev) => ({
      //     ...prev,
      //     brandLogo: `Invalid resolution (${img.width}×${img.height}px). Required: 120×40px`,
      //   }));
      //   setLogoFile(null);
      // } else {
      setFormErrors((prev) => ({ ...prev, brandLogo: "" }));
      setLogoFile(file);
      // }
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
      <FormCard title="Brand Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Brand Name"
            name="brandName"
            type="text"
            value={formData.brandName}
            onChange={handleChange}
            placeholder="Enter brand name"
            error={formErrors.brandName}
            mandatory
          />
          <InputField
            label="Brand Email"
            name="brandEmail"
            type="email"
            value={formData.brandEmail}
            onChange={handleChange}
            placeholder="Enter brand email"
            error={formErrors.brandEmail}
            mandatory
          />
          <SelectInput
            label="Country Code"
            options={countryCode}
            value={
              countryCode.find(
                (o) => o.value === formData.brandMobileCountryCode,
              ) || null
            }
            onChange={(opt) =>
              setFormData((p) => ({
                ...p,
                brandMobileCountryCode: opt.value,
              }))
            }
            placeholder="Search country code..."
            error={formErrors.brandMobileCountryCode}
            mandatory
          />
          <InputField
            label="Brand Mobile"
            name="brandMobile"
            type="tel"
            value={formData.brandMobile}
            onChange={handleChange}
            placeholder="Enter brand mobile number"
            error={formErrors.brandMobile}
            mandatory
          />
          <InputField
            label="Brand Website"
            name="brandWebsite"
            type="text"
            value={formData.brandWebsite}
            onChange={handleChange}
            placeholder="Enter brand website"
          />
          <InputField
            label="GST Number"
            name="brandGST"
            type="text"
            value={formData.brandGST}
            onChange={handleChange}
            placeholder="Enter GST Number"
          />
          <InputField
            label="Zipcode"
            name="brandZipcode"
            type="text"
            value={formData.brandZipcode}
            onChange={handleChange}
            placeholder="Zipcode"
            error={formErrors.brandZipcode}
          />
          <SelectInput
            label="Country"
            options={countrySelectOptions}
            value={
              countrySelectOptions.find(
                (o) => o.value === formData.brandCountry,
              ) || null
            }
            onChange={(opt) =>
              setFormData((p) => ({
                ...p,
                brandCountry: opt.value,
                brandState: "",
                brandDistrict: "",
              }))
            }
            placeholder="Search country..."
            error={formErrors.brandCountry}
            mandatory
          />
          <SelectInput
            label="State"
            options={states.map((s) => ({ value: s.isoCode, label: s.name }))}
            value={
              states
                .map((s) => ({ value: s.isoCode, label: s.name }))
                .find((o) => o.value === formData.brandState) || null
            }
            onChange={(opt) =>
              setFormData((p) => ({
                ...p,
                brandState: opt.value,
                brandDistrict: "",
              }))
            }
            placeholder="Search state..."
            error={formErrors.brandState}
            mandatory
          />
          <SelectInput
            label="District"
            options={districts.map((d) => ({ value: d.name, label: d.name }))}
            value={
              districts
                .map((d) => ({ value: d.name, label: d.name }))
                .find((o) => o.value === formData.brandDistrict) || null
            }
            onChange={(opt) =>
              setFormData((p) => ({ ...p, brandDistrict: opt.value }))
            }
            placeholder="Search district..."
            error={formErrors.brandDistrict}
            mandatory
          />
          <TextArea
            label="Brand Address"
            name="brandAddress"
            value={formData.brandAddress}
            onChange={handleChange}
            placeholder="Address"
            error={formErrors.brandAddress}
          />

          <div className="flex flex-col gap-1.5">
            <FileInput
              label="Brand Logo"
              desc="(Recommended resolution: 120 × 40 px. Accepted formats: JPEG, PNG.)"
              name="brandLogo"
              onChange={handleLogoChange}
              error={formErrors.brandLogo}
              mandatory
            />

            {(logoFile || formData.brandLogo) && (
              <img
                src={
                  logoFile
                    ? URL.createObjectURL(logoFile)
                    : formData.brandLogo.startsWith("http")
                      ? formData.brandLogo
                      : `http://localhost:3000${formData.brandLogo}`
                }
                alt="Brand Logo Preview"
                className="w-2/4 m-2 rounded-lg"
              />
            )}
          </div>
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

export default BrandForm;
