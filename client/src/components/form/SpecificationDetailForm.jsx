import React, { useEffect, useState } from "react";
import InputField from "./input/InputField";
import SelectInput from "./input/SelectInput";
import axios from "axios";

const SpecificationDetailForm = ({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  brands = [],
  specifications = [],
  onSubmit,
  onCancel,
  submitLabel = "Submit",
}) => {
  const brandOptions = brands.map((b) => ({
    value: b._id,
    label: b.brandName,
  }));

  const specificationOptions = specifications.map((s) => ({
    value: s._id,
    label: s.specificationName,
  }));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <SelectInput
        label="Brand"
        options={brandOptions}
        value={brandOptions.find((o) => o.value === formData.brandId) || null}
        onChange={(opt) => {
          if (opt) {
            setFormData((p) => ({
              ...p,
              brandId: opt.value,
              specificationId: "",
            }));
            setFormErrors((p) => ({ ...p, brandId: "" }));
          }
        }}
        placeholder="Search brand..."
        error={formErrors.brandId}
        mandatory
      />

      <SelectInput
        label="Specification"
        options={specificationOptions}
        value={
          specificationOptions.find(
            (o) => o.value === formData.specificationId,
          ) || null
        }
        onChange={(opt) => {
          if (opt) {
            setFormData((p) => ({ ...p, specificationId: opt.value }));
            setFormErrors((p) => ({ ...p, specificationId: "" }));
          }
        }}
        placeholder="Search specification..."
        error={formErrors.specificationId}
        mandatory
      />

      <InputField
        label="Specification Detail"
        name="specificationDetail"
        type="text"
        value={formData.specificationDetail}
        onChange={(e) => {
          setFormData((p) => ({ ...p, specificationDetail: e.target.value }));
          setFormErrors((p) => ({ ...p, specificationDetail: "" }));
        }}
        placeholder="Enter specification detail"
        error={formErrors.specificationDetail}
        mandatory
      />

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-md border border-(--border-color) text-sm font-medium"
        >
          Cancel
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

export default SpecificationDetailForm;
