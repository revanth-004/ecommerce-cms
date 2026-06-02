import React from "react";
import InputField from "./input/InputField";
import SelectInput from "./input/SelectInput";

const SpecificationForm = ({
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

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <SelectInput
        label="Brand"
        options={brandOptions}
        value={brandOptions.find((o) => o.value === formData.brandId) || null}
        onChange={(opt) => {
          setFormData((p) => ({ ...p, brandId: opt.value }));
          setFormErrors((p) => ({ ...p, brandId: "" }));
        }}
        placeholder="Search brand..."
        error={formErrors.brandId}
        mandatory
      />

      <InputField
        label="Specification Name"
        name="specificationName"
        type="text"
        value={formData.specificationName}
        onChange={(e) => {
          setFormData((p) => ({ ...p, specificationName: e.target.value }));
          setFormErrors((p) => ({ ...p, specificationName: "" }));
        }}
        placeholder=""
        error={formErrors.specificationName}
        mandatory
      />

      <button
        type="submit"
        className="px-6 py-2 bg-(--color-primary) text-white border border-(--border-color) rounded-md font-medium shadow-sm"
      >
        Save Changes
      </button>
    </form>
  );
};

export default SpecificationForm;
