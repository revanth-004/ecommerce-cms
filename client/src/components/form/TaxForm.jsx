import React from "react";
import InputField from "./input/InputField";
import FileInput from "./input/FileInput";
import SelectInput from "./input/SelectInput";

const TaxForm = ({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  onSubmit,
  onCancel,
  submitLabel = "Submit",
}) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <InputField
        label="Tax Name"
        name="taxName"
        type="text"
        value={formData.taxName}
        onChange={(e) => {
          setFormData((p) => ({ ...p, taxName: e.target.value }));
          setFormErrors((p) => ({ ...p, taxName: "" }));
        }}
        placeholder=""
        error={formErrors.taxName}
        mandatory
      />
      <InputField
        label="Tax Value (in %)"
        name="taxValue"
        type="number"
        value={formData.taxValue}
        onChange={(e) => {
          setFormData((p) => ({ ...p, taxValue: e.target.value }));
          setFormErrors((p) => ({ ...p, taxValue: "" }));
        }}
        placeholder=""
        error={formErrors.taxValue}
        mandatory
      />

      <button
        type="submit"
        className="px-6 py-2 bg-(--color-primary) text-white border border-(--border-color) rounded-md font-medium shadow-sm"
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default TaxForm;
