import React from "react";
import InputField from "./input/InputField";
import FileInput from "./input/FileInput";
import SelectInput from "./input/SelectInput";
import { Image as AntImage } from "antd";

const ProductCategoriesForm = ({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  brands = [],
  categories = [],
  logoFile,
  setLogoFile,
  onSubmit,
  onCancel,
  submitLabel = "Submit",
}) => {
  const brandOptions = brands.map((b) => ({
    value: b._id,
    label: b.brandName,
  }));
  const parentOptions = categories.map((n) => ({
    value: n._id,
    label: n.categoryTitle,
  }));

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      // if (img.width !== 120 || img.height !== 40) {
      //   setLogoFile(null);
      // } else {
      setFormErrors((prev) => ({ ...prev, categoryLogo: "" }));
      setLogoFile(file);
      // }
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  };

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
      <SelectInput
        label="Product Category Parent"
        options={parentOptions}
        value={
          parentOptions.find((o) => o.value === formData.categoryParentId) ||
          null
        }
        onChange={(opt) => {
          setFormData((p) => ({ ...p, categoryParentId: opt.value }));
          setFormErrors((p) => ({ ...p, categoryParentId: "" }));
        }}
        placeholder="Search category..."
      />
      <InputField
        label="Product Category Title"
        name="categoryTitle"
        type="text"
        value={formData.categoryTitle}
        onChange={(e) => {
          setFormData((p) => ({ ...p, categoryTitle: e.target.value }));
          setFormErrors((p) => ({ ...p, categoryTitle: "" }));
        }}
        placeholder="Title..."
        error={formErrors.categoryTitle}
        mandatory
      />
      <FileInput
        label="Product Category Logo"
        desc="(Recommended resolution: 120 × 40 px. Accepted formats: JPEG, PNG.)"
        name="categoryLogo"
        onChange={handleLogoChange}
        error={formErrors.categoryLogo}
        mandatory
      />
      {(logoFile || formData.categoryLogo) && (
        <AntImage
          src={
            logoFile
              ? URL.createObjectURL(logoFile)
              : `http://localhost:3000${formData.categoryLogo}`
          }
          alt="Product Category Logo Preview"
          className=" rounded-lg"
          style={{
            width: "auto",
            height: "100px",
            objectFit: "contain", // Keeps aspect ratio
            maxWidth: "100%", // Prevents overflow
          }}
        />
      )}
      <button
        type="submit"
        className="px-6 py-2 bg-(--color-primary) text-white border border-(--border-color) rounded-md font-medium shadow-sm"
      >
        Save Changes
      </button>
    </form>
  );
};

export default ProductCategoriesForm;
