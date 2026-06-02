import React from "react";
import InputField from "./input/InputField";
import FileInput from "./input/FileInput";
import TextArea from "./input/TextArea";
import SelectInput from "./input/SelectInput";

const AddProductForm = ({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  brands = [],
  categories = [],
  onSubmit,
  onCancel,
}) => {
  const brandOptions = brands.map((b) => ({
    value: b._id,
    label: b.brandName,
  }));
  const categoryOptions = categories.map((n) => ({
    value: n._id,
    label: n.categoryTitle,
  }));
  console.log(categories);
  console.log(categoryOptions);
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
        label="Product Category"
        options={categoryOptions}
        value={
          categoryOptions.find((o) => o.value === formData.productCategoryId) ||
          null
        }
        onChange={(opt) => {
          setFormData((p) => ({ ...p, productCategoryId: opt.value }));
          setFormErrors((p) => ({ ...p, productCategoryId: "" }));
        }}
        placeholder="Search category..."
        error={formErrors.productCategoryId}
        mandatory
      />
      <InputField
        label="Product Name"
        name="productName"
        type="text"
        value={formData.productName}
        onChange={(e) => {
          setFormData((p) => ({ ...p, productName: e.target.value }));
          setFormErrors((p) => ({ ...p, productName: "" }));
        }}
        placeholder=""
        error={formErrors.productName}
        mandatory
      />
      <TextArea
        label="Product Description"
        name="productDescription"
        value={formData.productDescription}
        onChange={(e) => {
          setFormData((p) => ({ ...p, productDescription: e.target.value }));
          setFormErrors((p) => ({ ...p, productDescription: "" }));
        }}
        placeholder="Description ..."
        error={formErrors.productDescription}
        mandatory
      />

      <button
        type="submit"
        className="px-6 py-2 bg-(--color-primary) text-white border border-(--border-color) rounded-md font-medium shadow-sm"
      >
        Add Product
      </button>
    </form>
  );
};

export default AddProductForm;
