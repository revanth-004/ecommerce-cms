import axios from "axios";
import React, { useState, useEffect } from "react";
import FormCard from "./form-ui/FormCard";
import FormLabel from "./form-ui/FormLabel";
import InputField from "./input/InputField";
import TextArea from "./input/TextArea";
import FileInput from "./input/FileInput";
import SelectInput from "./input/SelectInput";
import CalenderInput from "./input/CalenderInput";
import { Image as AntImage, Select } from "antd";
import dayjs from "dayjs";

const CouponForm = ({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  brands = [],
  couponToCustomers = [],
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

  const couponMethod = [
    { value: "persentage", label: "Percentage %" },
    { value: "amount", label: "Amount ₹" },
    { value: "full", label: "Full" },
  ];
  const couponCategory = [
    { value: "customers", label: "Customer" },
    { value: "1stTime", label: "1st Time" },
    { value: "greaterThan", label: "Greater Than (>)" },
  ];

  let couponToCustomerOptions = [];

  if (formData?.couponCategory === "customers") {
    couponToCustomerOptions = couponToCustomers.map((o) => ({
      value: o._id,
      label: o.customerFirstName,
    }));
  }

  const handleDateChange = (date, dateString, name) => {
    setFormData((prev) => ({
      ...prev,
      couponValidity: {
        ...prev.couponValidity,
        [name]: dateString,
      },
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormCard title="Coupon Details">
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
            label="Coupon Name"
            name="couponName"
            type="text"
            value={formData?.couponName}
            onChange={handleChange}
            placeholder="Enter Coupon name"
            error={formErrors.couponName}
            mandatory
          />
          <TextArea
            label="Coupon Description"
            name="couponDescription"
            value={formData.couponDescription}
            onChange={(e) => {
              setFormData((p) => ({
                ...p,
                couponDescription: e.target.value,
              }));
              setFormErrors((p) => ({ ...p, couponDescription: "" }));
            }}
            rows={3}
            placeholder="Description ..."
            error={formErrors.couponDescription}
            mandatory
          />
          <InputField
            label="Coupon Code"
            name="couponCode"
            type="text"
            value={formData?.couponCode}
            onChange={handleChange}
            placeholder="Enter Coupon Code"
            error={formErrors.couponCode}
            mandatory
          />
          <div className="grid grid-cols-2 gap-2">
            <InputField
              label="Coupon Value"
              name="couponValue"
              disabled={formData.couponMethod === "full"}
              type="number"
              value={formData.couponValue}
              onChange={handleChange}
              placeholder="Enter Coupon Value"
              error={formErrors?.couponValue}
            />

            <SelectInput
              label="Coupon Method"
              className=""
              options={couponMethod}
              value={couponMethod.find(
                (o) => o.value === formData.couponMethod || null,
              )}
              onChange={(opt) => {
                const newValue = opt?.value;
                setFormData((prev) => ({
                  ...prev,
                  couponMethod: newValue,
                  couponValue: newValue === "full" ? "" : prev.couponValue,
                }));
              }}
              placeholder="Choose..."
              error={formErrors.couponMethod}
              mandatory
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <SelectInput
              label="Coupons"
              className=""
              options={couponCategory}
              value={couponCategory.find(
                (o) => o.value === formData?.couponCategory || null,
              )}
              onChange={(opt) => {
                setFormData((p) => ({
                  ...p,
                  couponCategory: opt?.value,
                  couponToCustomers: "",
                }));
              }}
              placeholder="Choose..."
              error={formErrors?.couponCategory}
              mandatory
            />

            {formData.couponCategory === "customers" && (
              <Select
                mode="multiple"
                placeholder="Please select"
                value={formData.couponToCustomers || []}
                onChange={(opt) =>
                  setFormData((p) => ({
                    ...p,
                    couponToCustomers: opt,
                  }))
                }
                options={couponToCustomerOptions}
              />
            )}
            {formData.couponCategory === "greaterThan" && (
              <InputField
                label="Amount "
                name="couponValueGreaterThan"
                type="text"
                value={formData?.couponValueGreaterThan}
                onChange={handleChange}
                placeholder="Enter Amount"
                error={formErrors.couponValueGreaterThan}
                mandatory
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <FormLabel
              title={"Coupon Validity"}
              className=""
              mandatory={true}
            />
            <div className="flex gap-4">
              <CalenderInput
                label=""
                value={
                  formData.couponValidity.from
                    ? dayjs(formData.couponValidity.from, "DD-MM-YYYY")
                    : null
                }
                format="DD-MM-YYYY"
                placeholder="From"
                error={formErrors?.couponValidity}
                onChange={(date, dateString) =>
                  handleDateChange(date, dateString, "from")
                }
                mandatory
              />
              <CalenderInput
                label=""
                value={
                  formData.couponValidity.to
                    ? dayjs(formData.couponValidity.to, "DD-MM-YYYY")
                    : null
                }
                format="DD-MM-YYYY"
                placeholder="To"
                error={formErrors?.couponValidity}
                onChange={(date, dateString) =>
                  handleDateChange(date, dateString, "to")
                }
                mandatory
              />
            </div>
          </div>
          {/* <div className="flex flex-col gap-2">
            <FileInput
              label="Coupon Banner"
              desc="(Recommended resolution: 120 × 40 px. Accepted formats: JPEG, PNG.)"
              name="couponBanner"
              onChange={handleBannerChange}
              error={formErrors.couponBanner}
              mandatory
            />
            {(bannerFile || formData.couponBanner) && (
              <AntImage
                src={
                  bannerFile
                    ? URL.createObjectURL(bannerFile)
                    : `http://localhost:3000${formData.couponBanner}`
                }
                alt="Coupon Banner Preview"
                className="rounded-lg"
                style={{
                  width: "auto",
                  height: "100px",
                  objectFit: "contain",
                  maxWidth: "100%",
                }}
              />
            )}
          </div> */}
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

export default CouponForm;
