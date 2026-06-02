export const validate = (formData) => {
  const errors = {};

  // Product Details
  if (!formData.productName?.trim())
    errors.productName = "Product name is required";
  if (!formData.brandId) errors.brandId = "Brand is required";
  if (!formData.productCategoryId)
    errors.productCategoryId = "Category is required";
  if (!formData.productDescription?.trim())
    errors.productDescription = "Description is required";

  // Product Specifications
  const specErrors = (formData.productSpecifications || []).map((ps) => {
    const e = {};
    if (!ps.productPrice) e.productPrice = "MRP price is required";
    if (!ps.productSellingPrice)
      e.productSellingPrice = "Selling price is required";
    if (
      ps.productPrice &&
      ps.productSellingPrice &&
      Number(ps.productSellingPrice) > Number(ps.productPrice)
    ) {
      e.productSellingPrice = "Selling price cannot exceed MRP";
    }
    // if (!ps.productStock && ps.productStock == 0)
    //   e.productStock = "Stock is required";
    if (!ps.tax) e.tax = "Tax is required";
    if (!ps.hsn) e.hsn = "HSN is required";
    if (ps?.productMedia?.length === 0) {
      e.productMedia = "Upload Media is required";
    }
    if (ps?.specifications?.length === 0) {
      e.specifications = "Specification is required";
    }

    return e;
  });

  if (specErrors.some((e) => Object.keys(e).length > 0))
    errors.productSpecifications = specErrors;

  // Seller
  if (!formData.productSeller?.sellerId) errors.sellerId = "Seller is required";
  // console.log("sellerMedia" + (formData.sellerMedia === undefined));
  if (formData?.sellerMedia?.length === 0) {
    errors.sellerMedia = "Upload Media is required ";
  }
  // if (!formData.defaultMedia) {
  //   errors.defaultMedia = "Default Media is required";
  // }

  return errors;
};
