import React, { useState, useEffect } from "react";
import axios from "axios";

import { useAppSelector } from "../../../hooks/reduxHooks";
import { selectSelectedCompany } from "../../../features/company/companySelectors";

import BasicTable from "../../../components/tables/BasicTable/BasicTable";
import TaxForm from "../../../components/form/TaxForm";
import { useToast } from "../../../context/ToastContext";

const initialState = {
  companyId: "",
  taxName: "",
  taxValue: "",
};

const initialErrors = {
  taxName: "",
  taxValue: "",
};

const Tax = () => {
  const { showToast } = useToast();
  const [taxes, setTaxes] = useState([]);
  const [addTax, setAddTax] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [formErrors, setFormErrors] = useState(initialErrors);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const selectedCompany = useAppSelector(selectSelectedCompany);

  const tableHeaders = [
    ["taxName", "Tax Name"],
    ["taxValue", "Tax Value (%)"],
  ];

  const filteredTaxes = taxes.filter(
    (tax) =>
      tax.taxName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tax.taxValue?.toString().includes(searchQuery),
  );

  const fetchTaxes = async () => {
    if (!selectedCompany) return;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/taxes?companyId=${selectedCompany._id}`,
      );
      setTaxes(res.data.data);
    } catch (err) {
      console.error("Error fetching Taxes", err);
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, [selectedCompany?._id]);

  const handleEdit = (id) => {
    const tax = taxes.find((t) => t._id === id);
    if (tax) {
      setFormData({
        companyId: tax.companyId,
        taxName: tax.taxName,
        taxValue: tax.taxValue,
      });
      setEditingRecord(tax);
      setAddTax(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/taxes/${id}`,
      );

      showToast(response.data.message, "success");

      fetchTaxes();
    } catch (err) {
      showToast(response.data.message, "error");
      console.log(err);
    }
  };

  const exportCSV = () => {
    const headers = ["Tax Name", "Tax Value (%)"];
    const rows = taxes.map((tax) => [tax.taxName, tax.taxValue]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell ?? ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tax.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setAddTax(false);
    setFormData(initialState);
    setFormErrors(initialErrors);
    setEditingRecord(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.taxName) errors.taxName = "Tax Name is required";
    if (!formData.taxValue) errors.taxValue = "Tax Value is required";
    if (formData.taxValue && !/^\d+(\.\d+)?$/.test(formData.taxValue))
      errors.taxValue = "Must be a valid number";

    if (Object.keys(errors).length) {
      setFormErrors((prev) => ({ ...prev, ...errors }));
      return;
    }

    try {
      let updatedFormData = { ...formData, companyId: selectedCompany._id };

      if (editingRecord) {
        const response = await axios.put(
          `http://localhost:3000/api/taxes/${editingRecord._id}`,
          updatedFormData,
        );

        showToast(response.data.message, "success");
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/taxes",
          updatedFormData,
        );

        showToast(response.data.message, "success");
      }

      fetchTaxes();
      handleClose();
    } catch (err) {
      console.log("Status:", err.response?.status);
      console.log("Server message:", err.response?.data);

      showToast(response.data.message, "error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-(--border-color)">
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

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingRecord(null);
              setAddTax(true);
              setFormErrors(initialErrors);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-(--color-primary) rounded-lg shadow-lg active:scale-95"
          >
            + Add Tax
          </button>
        </div>
      </div>

      <BasicTable
        page="tax"
        filteredData={filteredTaxes}
        headers={tableHeaders}
        onEdit={handleEdit}
        onDelete={handleDelete}
        noView={true}
      />

      {addTax && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">
              {editingRecord ? "Edit Tax" : "Add Tax"}
            </h2>
            <TaxForm
              formData={formData}
              setFormData={setFormData}
              formErrors={formErrors}
              setFormErrors={setFormErrors}
              onSubmit={handleSubmit}
              onCancel={handleClose}
              submitLabel={editingRecord ? "Update" : "Submit"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tax;
