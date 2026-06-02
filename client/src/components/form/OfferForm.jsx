import axios from "axios";
import React, { useState, useEffect } from "react";
import FormCard from "./form-ui/FormCard";
import InputField from "./input/InputField";
import TextArea from "./input/TextArea";
import FileInput from "./input/FileInput";
import SelectInput from "./input/SelectInput";
import CalenderInput from "./input/CalenderInput";
import { Image as AntImage, Select } from "antd";
import dayjs from "dayjs";

const CustomerForm = ({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  brands = [],
  offerTo = [],
  bannerFile,
  setBannerFile,
  onSubmit,
  onCancel,
  submitLabel = "Submit",
}) => {
  const brandOptions = brands.map((b) => ({
    value: b._id,
    label: b.brandName,
  }));

  const offerMethod = [
    { value: "persentage", label: "Percentage %" },
    { value: "amount", label: "Amount ₹" },
  ];
  const offerCategory = [
    { value: "customers", label: "Customer" },
    { value: "products", label: "Product" },
    { value: "productCategory", label: "Product Category" },
  ];

  let offerToOptions = [];

  if (formData?.offerCategory === "customers") {
    offerToOptions = offerTo.map((o) => ({
      value: o._id,
      label: o.customerFirstName,
    }));
  } else if (formData?.offerCategory === "products") {
    offerToOptions = offerTo.map((o) => ({
      value: o._id,
      label: o.productName,
    }));
    console.log(offerToOptions);
  } else if (formData?.offerCategory === "productCategory") {
    offerToOptions = offerTo.map((o) => ({
      value: o._id,
      label: o.categoryTitle,
    }));
  }

  const handleDateChange = (date, dateString) => {
    setFormData((prev) => ({ ...prev, offerValidity: dateString }));
    if (formErrors.offerValidity) {
      setFormErrors((prev) => ({ ...prev, offerValidity: "" }));
    }
  };
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      setFormErrors((prev) => ({ ...prev, offerBanner: "" }));
      setBannerFile(file);
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormCard title="Offer Details">
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
            label="Offer Name"
            name="offerName"
            type="text"
            value={formData?.offerName}
            onChange={handleChange}
            placeholder="Enter Offer name"
            error={formErrors.offerName}
            mandatory
          />
          <div className="grid grid-cols-2 gap-2">
            <InputField
              label="Offer Value"
              name="offerValue"
              type="number"
              value={formData.offerValue}
              onChange={handleChange}
              placeholder="Enter Offer Value"
              error={formErrors?.offerValue}
            />

            <SelectInput
              label="Offer Method"
              className=""
              options={offerMethod}
              value={offerMethod.find(
                (o) => o.value === formData.offerMethod || null,
              )}
              onChange={(opt) =>
                setFormData((p) => ({
                  ...p,
                  offerMethod: opt?.value,
                }))
              }
              placeholder="Choose..."
              error={formErrors.offerMethod}
              mandatory
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <SelectInput
              label="Offers"
              className=""
              options={offerCategory}
              value={offerCategory.find(
                (o) => o.value === formData?.offerCategory || null,
              )}
              onChange={(opt) => {
                setFormData((p) => ({
                  ...p,
                  offerCategory: opt?.value,
                  offerTo: "",
                }));
              }}
              placeholder="Choose..."
              error={formErrors?.offerCategory}
              mandatory
            />

            <Select
              mode="multiple"
              placeholder="Please select"
              value={formData.offerTo || []}
              onChange={(opt) =>
                setFormData((p) => ({
                  ...p,
                  offerTo: opt,
                }))
              }
              options={offerToOptions}
            />
          </div>
          <CalenderInput
            label="Offer Validity"
            value={
              formData.offerValidity
                ? dayjs(formData.offerValidity, "DD-MM-YYYY")
                : null
            }
            format="DD-MM-YYYY"
            placeholder="Select validity date"
            error={formErrors?.offerValidity}
            onChange={handleDateChange}
            mandatory
          />
          <div className="flex flex-col gap-2">
            <FileInput
              label="Offer Banner"
              desc="(Recommended resolution: 120 × 40 px. Accepted formats: JPEG, PNG.)"
              name="offerBanner"
              onChange={handleBannerChange}
              error={formErrors.offerBanner}
              mandatory
            />
            {(bannerFile || formData.offerBanner) && (
              <AntImage
                src={
                  bannerFile
                    ? URL.createObjectURL(bannerFile)
                    : `http://localhost:3000${formData.offerBanner}`
                }
                alt="Offer Banner Preview"
                className="rounded-lg"
                style={{
                  width: "auto",
                  height: "100px",
                  objectFit: "contain",
                  maxWidth: "100%",
                }}
              />
            )}
          </div>
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
