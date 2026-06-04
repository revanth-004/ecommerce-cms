import React from "react";
import InputField from "./input/InputField";
import FileInput from "./input/FileInput";
import SelectInput from "./input/SelectInput";
import { Image as AntImage } from "antd";

const ArticleCategoriesForm = ({
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
    label: n.articleCategoryTitle,
  }));

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      setFormErrors((prev) => ({ ...prev, articleCategoryLogo: "" }));
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
        label="Article Category Parent"
        options={parentOptions}
        value={
          parentOptions.find(
            (o) => o.value === formData.articleCategoryParentId,
          ) || null
        }
        onChange={(opt) => {
          setFormData((p) => ({ ...p, articleCategoryParentId: opt.value }));
          setFormErrors((p) => ({ ...p, articleCategoryParentId: "" }));
        }}
        placeholder="Search category..."
      />
      <InputField
        label="Article Category Title"
        name="articleCategoryTitle"
        type="text"
        value={formData.articleCategoryTitle}
        onChange={(e) => {
          setFormData((p) => ({ ...p, articleCategoryTitle: e.target.value }));
          setFormErrors((p) => ({ ...p, articleCategoryTitle: "" }));
        }}
        placeholder="Title..."
        error={formErrors.articleCategoryTitle}
        mandatory
      />
      <FileInput
        label="Article Category Logo"
        desc="(Recommended resolution: 120 × 40 px. Accepted formats: JPEG, PNG.)"
        name="articleCategoryLogo"
        onChange={handleLogoChange}
        error={formErrors.articleCategoryLogo}
        mandatory
      />
      {(logoFile || formData.articleCategoryLogo) && (
        <AntImage
          src={
            logoFile
              ? URL.createObjectURL(logoFile)
              : `http://localhost:3000${formData.articleCategoryLogo}`
          }
          alt="Article Category Logo Preview"
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

export default ArticleCategoriesForm;
