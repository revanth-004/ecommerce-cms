import React, { useState } from "react";
import { Country, State, City } from "country-state-city";
import FormCard from "./form-ui/FormCard";
import InputField from "./input/InputField";
import TextArea from "./input/TextArea";
import FileInput from "./input/FileInput";
import SelectInput from "./input/SelectInput";
import CalenderInput from "./input/CalenderInput";
import { Image } from "antd";
import dayjs from "dayjs";

const CustomerForm = ({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  brands = [],
  onSubmit,
  onCancel,
  submitLabel = "Submit",
}) => {
  const brandOptions = brands.map((b) => ({
    value: b._id,
    label: b.brandName,
  }));
  const countries = Country.getAllCountries();
  const countrySelectOptions = countries.map((c) => ({
    value: c.isoCode,
    label: c.name,
  }));
  const countryCode = countries.map((c) => ({
    value: `+${c.phonecode}`,
    label: `${c.flag} +${c.phonecode} (${c.name})`,
  }));
  const states = formData.customerCountry
    ? State.getStatesOfCountry(formData.customerCountry)
    : [];
  const districts =
    formData.customerCountry && formData.customerState
      ? City.getCitiesOfState(formData.customerCountry, formData.customerState)
      : [];
  const addedFromOptions = [
    { value: "admin", label: "Admin" },
    { value: "website", label: "Website" },
  ];

  const handleDateChange = (date, dateString) => {
    setFormData((prev) => ({ ...prev, customerDateOfBirth: dateString }));
    if (formErrors.customerDateOfBirth) {
      setFormErrors((prev) => ({ ...prev, customerDateOfBirth: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormCard title="Customer Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectInput
            label="Brand"
            className=""
            options={brandOptions}
            value={brandOptions.find(
              (o) => o.value === formData.brandId || null,
            )}
            onChange={(opt) =>
              setFormData((p) => ({
                ...p,
                brandId: opt?.value,
              }))
            }
            placeholder="Choose..."
            error={formErrors.brandId}
            mandatory
          />
          <InputField
            label="Customer First Name"
            name="customerFirstName"
            type="text"
            value={formData.customerFirstName}
            onChange={handleChange}
            placeholder="Enter customer first name"
            error={formErrors.customerFirstName}
            mandatory
          />
          <InputField
            label="Customer Last Name"
            name="customerLastName"
            type="text"
            value={formData.customerLastName}
            onChange={handleChange}
            placeholder="Enter customer last name"
            error={formErrors.customerLastName}
            mandatory
          />
          <InputField
            label="Customer Email"
            name="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={handleChange}
            placeholder="Enter customer email"
            error={formErrors.customerEmail}
            mandatory
          />
          <div className="grid grid-cols-3 gap-2">
            <SelectInput
              label="Country Code"
              className=""
              options={countryCode}
              value={
                countryCode.find(
                  (o) => o.value === formData.customerMobileCountryCode,
                ) || null
              }
              onChange={(opt) =>
                setFormData((p) => ({
                  ...p,
                  customerMobileCountryCode: opt.value,
                }))
              }
              placeholder="+91"
              error={formErrors.customerMobileCountryCode}
              mandatory
            />
            <div className="col-span-2">
              <InputField
                label="Customer Mobile"
                className=""
                name="customerMobile"
                type="tel"
                value={formData.customerMobile}
                onChange={handleChange}
                placeholder="Enter customer mobile number"
                error={formErrors.customerMobile}
                mandatory
              />
            </div>
          </div>
          <div className="flex flex-col">
            <CalenderInput
              label="Date of Birth"
              value={
                formData.customerDateOfBirth
                  ? dayjs(formData.customerDateOfBirth, "DD-MM-YYYY")
                  : null
              }
              format="DD-MM-YYYY"
              placeholder="Select date of birth"
              error={formErrors?.customerDateOfBirth}
              onChange={handleDateChange}
              mandatory
            />
          </div>

          <FormCard
            title=" Billing Address"
            titleStyle="h4"
            className="flex flex-col gap-2"
          >
            <InputField
              label="Address"
              name="customerBillingAddressLine1"
              type="text"
              value={formData.customerBillingAddressLine1}
              onChange={handleChange}
              placeholder="Line 1..."
              error={formErrors?.customerBillingAddressLine1}
            />
            <InputField
              label=""
              name="customerBillingAddressLine2"
              type="text"
              value={formData.customerBillingAddressLine2}
              onChange={handleChange}
              placeholder="Line 2..."
              error={formErrors?.customerBillingAddressLine2}
            />
          </FormCard>
          <FormCard
            title=" Shipping Address"
            titleStyle="h4"
            className="flex flex-col gap-2"
          >
            <InputField
              label="Address"
              name="customerShippingAddressLine1"
              type="text"
              value={formData.customerShippingAddressLine1}
              onChange={handleChange}
              placeholder="Line 1..."
              error={formErrors?.customerShippingAddressLine1}
            />
            <InputField
              label=""
              name="customerShippingAddressLine2"
              type="text"
              value={formData.customerShippingAddressLine2}
              onChange={handleChange}
              placeholder="Line 2..."
              error={formErrors?.customerShippingAddressLine2}
            />
          </FormCard>

          <SelectInput
            label="Country"
            options={countrySelectOptions}
            value={
              countrySelectOptions.find(
                (o) => o.value === formData.customerCountry,
              ) || null
            }
            onChange={(opt) =>
              setFormData((p) => ({
                ...p,
                customerCountry: opt.value,
                customerState: "",
                customerDistrict: "",
              }))
            }
            placeholder="Search country..."
            error={formErrors.customerCountry}
            mandatory
          />
          <SelectInput
            label="State"
            options={states.map((s) => ({ value: s.isoCode, label: s.name }))}
            value={
              states
                .map((s) => ({ value: s.isoCode, label: s.name }))
                .find((o) => o.value === formData.customerState) || null
            }
            onChange={(opt) =>
              setFormData((p) => ({
                ...p,
                customerState: opt.value,
                customerDistrict: "",
              }))
            }
            placeholder="Search state..."
            error={formErrors.customerState}
            mandatory
          />
          <SelectInput
            label="District"
            options={districts.map((d) => ({ value: d.name, label: d.name }))}
            value={
              districts
                .map((d) => ({ value: d.name, label: d.name }))
                .find((o) => o.value === formData.customerDistrict) || null
            }
            onChange={(opt) =>
              setFormData((p) => ({ ...p, customerDistrict: opt.value }))
            }
            placeholder="Search district..."
            error={formErrors.customerDistrict}
            mandatory
          />
          <InputField
            label="Landmark"
            name="customerLandmark"
            type="text"
            value={formData.customerLandmark}
            onChange={handleChange}
            placeholder="Enter Landmark"
            error={formErrors?.customerLandmark}
          />
          <InputField
            label="Zipcode"
            name="customerZipcode"
            type="text"
            value={formData.customerZipcode}
            onChange={handleChange}
            placeholder="Zipcode"
            error={formErrors.customerZipcode}
          />
          <InputField
            label="GST Number"
            name="customerGST"
            type="text"
            value={formData.customerGST}
            onChange={handleChange}
            placeholder="Enter GST Number"
            error={formErrors?.customerGST}
          />

          <SelectInput
            label="Added From"
            className=""
            options={addedFromOptions}
            value={addedFromOptions.find(
              (o) => o.value === formData.addedFrom || null,
            )}
            onChange={(opt) =>
              setFormData((p) => ({
                ...p,
                addedFrom: opt?.value,
              }))
            }
            placeholder="Choose..."
            error={formErrors.addedFrom}
            mandatory
          />
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

export default CustomerForm;
