const Product = require("../models/Product");
const ProductDetail = require("../models/ProductDetail");
const apiResponse = require("../utils/apiResponse");

exports.postProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    return apiResponse(res).created(newProduct, "Product created successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { companyId, brandId, ids } = req.query;
    const filter = {};
    if (companyId) filter.companyId = companyId;
    if (brandId) filter.brandId = brandId;
    if (ids) {
      const idArray = ids.split(",");
      filter._id = { $in: idArray };
    }
    const products = await Product.find(filter);
    return apiResponse(res).success(products, "Products fetched successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return apiResponse(res).notFound("Product not found");

    const productDetail = await ProductDetail.findOne({
      productId: req.params.id,
    }).lean();

    // ← destructure out _id and productId from detail to avoid overwriting
    const { _id: detailId, productId, ...detailRest } = productDetail || {};

    const merged = {
      ...product,
      ...detailRest,
      productDetailId: detailId, // ← keep detail _id separately if needed
    };

    return apiResponse(res).success(merged, "Product fetched successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return apiResponse(res).notFound("Product not found");
    return apiResponse(res).success(null, "Product deleted successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.putProduct = async (req, res) => {
  try {
    // Split payload into Product and ProductDetail fields
    const {
      productName,
      brandId,
      productCategoryId,
      productDescription,
      companyId,

      // ProductDetail fields
      productSpecifications,
      productSeller,
      productSEO,
      productMeasurements,
      productTags,
    } = req.body;

    // Update Product
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        productName,
        brandId,
        productCategoryId,
        productDescription,
        companyId,
      },
      { new: true, runValidators: true },
    );
    if (!product) return apiResponse(res).notFound("Product not found");

    // Update or create ProductDetail
    const productDetail = await ProductDetail.findOneAndUpdate(
      { productId: req.params.id },
      {
        productId: req.params.id,
        productSpecifications,
        productSeller,
        productSEO,
        productMeasurements,
        productTags,
      },
      { new: true, upsert: true, runValidators: true }, // ← upsert creates if not exists
    );

    const merged = {
      ...product.toObject(),
      ...(() => {
        const { _id, productId, ...rest } = productDetail.toObject();
        return rest;
      })(),
    };

    return apiResponse(res).success(merged, "Product updated successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};
