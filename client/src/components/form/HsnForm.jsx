import React from "react";
import InputField from "./input/InputField";
import FileInput from "./input/FileInput";
import SelectInput from "./input/SelectInput";

const HsnForm = ({
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
        label="HSN Name"
        name="hsnName"
        type="text"
        value={formData.hsnName}
        onChange={(e) => {
          setFormData((p) => ({ ...p, hsnName: e.target.value }));
          setFormErrors((p) => ({ ...p, hsnName: "" }));
        }}
        placeholder=""
        error={formErrors.hsnName}
        mandatory
      />
      <InputField
        label="HSN Code"
        name="hsnCode"
        type="text"
        value={formData.hsnCode}
        onChange={(e) => {
          setFormData((p) => ({ ...p, hsnCode: e.target.value }));
          setFormErrors((p) => ({ ...p, hsnCode: "" }));
        }}
        placeholder=""
        error={formErrors.hsnCode}
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

export default HsnForm;
