import React from "react";
import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { useAppSelector } from "../../../hooks/reduxHooks";
import { selectSelectedCompany } from "../../../features/company/companySelectors";
import SpecificationForm from "../../../components/form/SpecificationForm";
import { Table, Space, Popconfirm, Button, Image } from "antd";
import axios from "axios";
import BasicTable from "../../../components/tables/BasicTable/BasicTable";
import { useToast } from "../../../context/ToastContext";

const initialState = {
  companyId: "",
  brandId: "",
  specificationName: "",
};
const initialErrors = {
  brandId: "",
  specificationName: "",
};

const Specification = () => {
  const { showToast } = useToast();
  const [specifications, setSpecifications] = useState([]);
  const [addSpecification, setAddSpecification] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [formErrors, setFormErrors] = useState(initialErrors);
  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCompany = useAppSelector(selectSelectedCompany);

  const [editingRecord, setEditingRecord] = useState(null);

  const tableHeaders = [
    ["specificationName", "Specification Name"],
    ["brandId", "Brand"],
  ];

  const specificationWithBrandNames = specifications.map((s) => ({
    ...s,
    brandId: brands.find((b) => b._id === s.brandId)?.brandName || s.brandId,
  }));

  const filteredSpecifications = specificationWithBrandNames.filter(
    (specification) =>
      specification.specificationName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );
  const exportCSV = () => {
    const headers = ["Specification Name", "Brand"];
    const rows = specifications.map((specification) => [
      specification.specificationName,
      brands.find((b) => b._id === specification.brandId)?.brandName ||
        specification.brandId,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell ?? ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Specification.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const fetchSpecification = async () => {
    if (!selectedCompany) return;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/specification?companyId=${selectedCompany._id}`,
      );
      setSpecifications(res.data.data);
    } catch (err) {
      console.error("Error fetching Specification", err);
    }
  };
  const handleEdit = (record) => {
    const rec = specifications.find((s) => s._id === record);
    setFormData({
      companyId: rec.companyId,
      brandId: rec.brandId,
      specificationName: rec.specificationName,
    });
    setEditingRecord(rec);
    setAddSpecification(true);
  };

  const handleClose = () => {
    setAddSpecification(false);
    setFormData(initialState);
    setFormErrors(initialErrors);
    setEditingRecord(null);
  };

  useEffect(() => {
    if (!selectedCompany) {
      setBrands([]);
      setSpecifications([]);
      return;
    }

    // Fetch brands
    axios
      .get(`http://localhost:3000/api/brands?companyId=${selectedCompany._id}`)
      .then((res) => setBrands(res.data.data))
      .catch((err) => console.error("Error fetching brands", err));

    // Fetch specifications
    fetchSpecification();

    return () => {
      setBrands([]);
      setSpecifications([]);
    };
  }, [selectedCompany?._id]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/specification/${id}`,
      );

      showToast(response.data.message, "success");
      fetchSpecification();
    } catch (err) {
      console.error("Delete error", err);
      showToast(response.data.message, "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.brandId) errors.brandId = "Brand is required";
    if (!formData.specificationName)
      errors.specificationName = "Specification name is required";

    if (Object.keys(errors).length) {
      setFormErrors((prev) => ({ ...prev, ...errors }));
      return;
    }

    try {
      let updatedFormData = { ...formData, companyId: selectedCompany._id };

      if (editingRecord) {
        const response = await axios.put(
          `http://localhost:3000/api/specification/${editingRecord._id}`,
          updatedFormData,
        );
        showToast(response.data.message, "success");
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/specification",
          updatedFormData,
        );
        showToast(response.data.message, "success");
      }

      fetchSpecification();
      handleClose();
    } catch (err) {
      console.log("Status:", err.response?.status);
      console.log("Server message:", err.response?.data);
      showToast(response.data.message, "error");
    }
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
            setEditingRecord(null);
            setAddSpecification(true);
            setFormErrors(initialErrors);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-(--color-primary) rounded-lg shadow-lg active:scale-95"
        >
          + Add Specification
        </button>
      </div>
      <div className="">
        <BasicTable
          page="tax"
          filteredData={filteredSpecifications}
          headers={tableHeaders}
          onEdit={handleEdit}
          onDelete={handleDelete}
          noView={true}
        />
      </div>
      {addSpecification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <button
              onClick={() => {
                setAddSpecification(false);
                setFormData(initialState);
                setFormErrors(initialErrors);
              }}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">
              {editingRecord ? "Edit Specification" : "Add Specification"}
            </h2>
            <SpecificationForm
              formData={formData}
              setFormData={setFormData}
              formErrors={formErrors}
              setFormErrors={setFormErrors}
              brands={brands}
              onSubmit={handleSubmit}
              onCancel={() => setAddSpecification(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Specification;
