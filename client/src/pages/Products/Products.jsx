import React from "react";
import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { useAppSelector } from "../../hooks/reduxHooks";
import { selectSelectedCompany } from "../../features/company/companySelectors";
import AddProductForm from "../../components/form/AddProductForm";
import { Table, Space, Popconfirm, Button, Image } from "antd";
import axios from "axios";
import BasicTable from "../../components/tables/BasicTable/BasicTable";
import { useToast } from "../../context/ToastContext";

const initialState = {
  companyId: "",
  brandId: "",
  productName: "",
  productCategoryId: "",
  productDescription: "",
};
const initialErrors = {
  brandId: "",
  productName: "",
  productCategoryId: "",
  productDescription: "",
};

const Products = () => {
  const { showToast } = useToast();
  const [addProduct, setAddProduct] = useState(false); //Toggle Add product
  const [formData, setFormData] = useState(initialState); //Product form data
  const [formErrors, setFormErrors] = useState(initialErrors); //Product form error
  const [brands, setBrands] = useState([]); //Form dropdown for brand and brand Name
  const [categories, setCategories] = useState([]); //Form dropdown fro product categories
  const [allProducts, setAllProducts] = useState([]); // Table data
  const [searchQuery, setSearchQuery] = useState("");
  const selectedCompany = useAppSelector(selectSelectedCompany);

  const handleClose = () => {
    setAddProduct(false);
    setFormData(initialState);
    setFormErrors(initialErrors);
  };

  const fetchAllProducts = () => {
    if (!selectedCompany) return;
    axios
      .get(
        `http://localhost:3000/api/products?companyId=${selectedCompany._id}`,
      )
      .then((res) => setAllProducts(res.data.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (!selectedCompany)
      return () => {
        setBrands([]);
      };

    // Fetch brands
    axios
      .get(`http://localhost:3000/api/brands?companyId=${selectedCompany._id}`)
      .then((res) => setBrands(res.data.data))
      .catch((err) => console.error("Error fetching brands", err));

    // Fetch categories
    fetchAllProducts();

    return () => {
      setBrands([]);
    };
  }, [selectedCompany?._id]);

  //When Brand changes in form categories for a brand is fetched
  useEffect(() => {
    if (!formData.brandId) return setCategories([]);

    axios
      .get(
        `http://localhost:3000/api/productCategory?brandId=${formData.brandId}`,
      )
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error("Error fetching categories", err));

    return () => setCategories([]);
  }, [formData.brandId]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/products/${id}`,
      );

      showToast(response.data.message, "success");
      fetchAllProducts();
    } catch (err) {
      console.error("Delete error", err);
      showToast(response.data.message, "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.brandId) errors.brandId = "Brand is required";
    if (!formData.productName) errors.productName = "Product Name is required";
    if (!formData.productCategoryId)
      errors.productCategoryId = "Product Category is required";
    if (!formData.productDescription)
      errors.productDescription = "Product Description is required";

    if (Object.keys(errors).length) {
      setFormErrors((prev) => ({ ...prev, ...errors }));
      return;
    }

    try {
      let updatedFormData = { ...formData, companyId: selectedCompany._id };
      const response = await axios.post(
        "http://localhost:3000/api/products",
        updatedFormData,
      );

      showToast(response.data.message, "success");
      fetchAllProducts();
      handleClose();
    } catch (err) {
      showToast(err.response?.status, "error");
      console.log("Status:", err.response?.status);
      console.log("Server message:", err.response?.data);
    }
  };

  const tableHeaders = [
    ["productName", "Product Name"],
    ["brandId", "Brand"],
  ];

  const productWithBrandNames = allProducts.map((s) => ({
    ...s,
    brandId: brands.find((b) => b._id === s.brandId)?.brandName || s.brandId,
  }));

  const filteredproducts = productWithBrandNames.filter((product) =>
    product.productName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const exportCSV = () => {
    const headers = ["Product Name", "Brand"];
    console.log(categories);
    const rows = allProducts.map((product) => [
      product.productName,
      brands.find((b) => b._id === product.brandId)?.brandName ||
        product.brandId,

      product.productDescription,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell ?? ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "productCategoryId.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="">
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-64 px-4 py-2 text-sm border border-(--border-color) rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-(--color-primary) border border-(--border-color) rounded-lg shadow-sm"
        >
          <span>Export CSV</span>
        </button>
      </div>
      <div className="flex pb-6 items-center justify-end  border-b border-(--border-color)">
        <button
          onClick={() => {
            setAddProduct(true);
            setFormErrors(initialErrors);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-(--color-primary) rounded-lg shadow-lg active:scale-95"
        >
          + Add Product
        </button>
      </div>
      <div className="">
        <BasicTable
          page="products"
          filteredData={filteredproducts}
          headers={tableHeaders}
          onDelete={handleDelete}
          noView={true}
        />
      </div>
      {addProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <button
              onClick={() => {
                setAddProduct(false);
                setFormData(initialState);
                setFormErrors(initialErrors);
              }}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">Add Product</h2>
            <AddProductForm
              formData={formData}
              setFormData={setFormData}
              formErrors={formErrors}
              setFormErrors={setFormErrors}
              brands={brands}
              categories={categories}
              onSubmit={handleSubmit}
              onCancel={() => setAddProduct(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
