import React from "react";
import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { useAppSelector } from "../../../hooks/reduxHooks";
import { selectSelectedCompany } from "../../../features/company/companySelectors";
import ProductCategoriesForm from "../../../components/form/ProductCategoriesForm";
import { Table, Space, Popconfirm, Button, Image } from "antd";
import axios from "axios";

import { useToast } from "../../../context/ToastContext";

const initialState = {
  companyId: "",
  brandId: "",
  categoryTitle: "",
  categoryLogo: "",
  categoryParentId: "",
};
const initialErrors = {
  brandId: "",
  categoryTitle: "",
  categoryLogo: "",
};
const buildTree = (items) => {
  const map = {};
  const roots = [];

  items.forEach((item) => {
    map[item._id] = { ...item, key: item._id, children: [] };
  });

  items.forEach((item) => {
    if (item.categoryParentId && map[item.categoryParentId]) {
      map[item.categoryParentId].children.push(map[item._id]);
    } else {
      roots.push(map[item._id]);
    }
  });

  // Remove empty children arrays (so Ant Design doesn't show expand arrow)
  const clean = (nodes) =>
    nodes.map((n) => ({
      ...n,
      children: n.children.length ? clean(n.children) : undefined,
    }));

  return clean(roots);
};

const ProductCategories = () => {
  const { showToast } = useToast();
  const [addProduct, setAddProduct] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [formErrors, setFormErrors] = useState(initialErrors);
  const [logoFile, setLogoFile] = useState(null);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const selectedCompany = useAppSelector(selectSelectedCompany);

  const [editingRecord, setEditingRecord] = useState(null);

  const handleEdit = (record) => {
    setFormData({
      companyId: record.companyId,
      brandId: record.brandId,
      categoryTitle: record.categoryTitle,
      categoryLogo: record.categoryLogo,
      categoryParentId: record.categoryParentId || "",
    });
    setEditingRecord(record);
    setAddProduct(true);
  };

  const handleClose = () => {
    setAddProduct(false);
    setFormData(initialState);
    setFormErrors(initialErrors);
    setLogoFile(null);
    setEditingRecord(null);
  };

  const fetchCategories = () => {
    if (!selectedCompany) return;
    axios
      .get(
        `http://localhost:3000/api/productCategory?companyId=${selectedCompany._id}`,
      )
      .then((res) => setAllCategories(res.data.data))
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
    fetchCategories();

    return () => {
      setBrands([]);
    };
  }, [selectedCompany?._id]);

  //When Brand changes categories for a brand fetched
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
    const recordToDelete = allCategories.find((r) => r._id === id);
    const hasChildren = allCategories.some((r) => r.categoryParentId === id);

    if (hasChildren) {
      showToast(
        "Cannot delete category with child categories. Delete children all categories first.",
        "warning",
      );

      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:3000/api/productCategory/${id}`,
      );

      showToast(response.data.message, "success");
      fetchCategories();
    } catch (err) {
      console.error("Delete error", err);
      showToast(response.data.message, "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.brandId) errors.brandId = "Brand is required";
    if (!formData.categoryTitle)
      errors.categoryTitle = "Category title is required";
    if (!logoFile && !formData.categoryLogo)
      errors.categoryLogo = "Logo is required";

    if (Object.keys(errors).length) {
      setFormErrors((prev) => ({ ...prev, ...errors }));
      return;
    }

    try {
      let updatedFormData = { ...formData, companyId: selectedCompany._id };
      if (logoFile) {
        const uploadData = new FormData();
        uploadData.append("file", logoFile);
        const res = await axios.post(
          "http://localhost:3000/upload",
          uploadData,
        );
        updatedFormData.categoryLogo = res.data.filePath;
      }

      if (editingRecord) {
        const response = await axios.put(
          `http://localhost:3000/api/productCategory/${editingRecord._id}`,
          updatedFormData,
        );
        showToast(response.data.message, "success");
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/productCategory",
          updatedFormData,
        );
        showToast(response.data.message, "success");
      }

      fetchCategories();
      handleClose();
    } catch (err) {
      showToast(response.data.message, "error");
      console.log("Status:", err.response?.status);
      console.log("Server message:", err.response?.data);
    }
  };

  const exportCSV = () => {
    const headers = ["SpecializationDetail Name", "Brand"];
    const rows = allCategories.map((category) => [
      category.categoryTitle,
      brands.find((b) => b._id === category.brandId)?.brandName ||
        category.brandId,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell ?? ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "productCategory.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      title: "Product Category Title",
      dataIndex: "categoryTitle",
    },
    {
      title: "Image",
      dataIndex: "categoryLogo",
      width: "8%",
      render: (src) =>
        src ? (
          <div className="">
            <Image
              alt="webp image"
              width={100}
              src={`http://localhost:3000${src}`}
            />
          </div>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },

    {
      title: "Brand",
      dataIndex: "brandId",
      width: "20%",
      render: (id) => brands.find((b) => b._id === id)?.brandName || id,
    },
    {
      title: "Actions",
      width: "25%",
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this category?"
            description="Children will also be removed."
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
            setEditingRecord(null);
            setAddProduct(true);
            setFormErrors(initialErrors);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-(--color-primary) rounded-lg shadow-lg active:scale-95"
        >
          + Add Product Category
        </button>
      </div>
      <div className="">
        <Table
          columns={columns}
          dataSource={buildTree(allCategories)}
          rowKey="_id"
          className="mt-4"
          pagination={{ pageSize: 10 }}
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
                setLogoFile(null);
              }}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">
              {editingRecord ? "Edit Product Category" : "Add Product Category"}
            </h2>
            <ProductCategoriesForm
              formData={formData}
              setFormData={setFormData}
              formErrors={formErrors}
              setFormErrors={setFormErrors}
              brands={brands}
              categories={categories}
              logoFile={logoFile}
              setLogoFile={setLogoFile}
              onSubmit={handleSubmit}
              onCancel={() => setAddProduct(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCategories;
