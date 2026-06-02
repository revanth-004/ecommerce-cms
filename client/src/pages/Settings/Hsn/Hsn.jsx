import React, { useState, useEffect } from "react";
import axios from "axios";

import { useAppSelector } from "../../../hooks/reduxHooks";
import { selectSelectedCompany } from "../../../features/company/companySelectors";

import BasicTable from "../../../components/tables/BasicTable/BasicTable";
import HsnForm from "../../../components/form/HsnForm";
import { useToast } from "../../../context/ToastContext";

const initialState = {
  companyId: "",
  hsnName: "",
  hsnCode: "",
};

const initialErrors = {
  hsnName: "",
  hsnCode: "",
};

const Tax = () => {
  const { showToast } = useToast();
  const [hsn, setHsn] = useState([]);
  const [addHsn, setAddHsn] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [formErrors, setFormErrors] = useState(initialErrors);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const selectedCompany = useAppSelector(selectSelectedCompany);

  const tableHeaders = [
    ["hsnName", "HSN Name"],
    ["hsnCode", "HSN Code"],
  ];

  const filteredHsn = hsn.filter(
    (tax) =>
      tax.hsnName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tax.hsnCode?.toString().includes(searchQuery),
  );

  const fetchHsn = async () => {
    if (!selectedCompany) return;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/hsn?companyId=${selectedCompany._id}`,
      );
      setHsn(res.data.data);
    } catch (err) {
      console.error("Error fetching Hsn", err);
    }
  };

  useEffect(() => {
    fetchHsn();
  }, [selectedCompany?._id]);

  const handleEdit = (id) => {
    const h = hsn.find((t) => t._id === id);
    if (h) {
      setFormData({
        companyId: h.companyId,
        hsnName: h.hsnName,
        hsnCode: h.hsnCode,
      });
      setEditingRecord(h);
      setAddHsn(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/hsn/${id}`,
      );

      showToast(response.data.message, "success");
      fetchHsn();
    } catch (err) {
      showToast(response.data.message, "error");
    }
  };

  const exportCSV = () => {
    const headers = ["HSN Name", "HSN Code"];
    const rows = hsn.map((h) => [h.hsnName, h.hsnCode]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell ?? ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hsn.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setAddHsn(false);
    setFormData(initialState);
    setFormErrors(initialErrors);
    setEditingRecord(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.hsnName) errors.hsnName = "Tax Name is required";
    if (!formData.hsnCode) errors.hsnCode = "Tax Value is required";

    if (Object.keys(errors).length) {
      setFormErrors((prev) => ({ ...prev, ...errors }));
      return;
    }

    try {
      let updatedFormData = { ...formData, companyId: selectedCompany._id };

      if (editingRecord) {
        const response = await axios.put(
          `http://localhost:3000/api/hsn/${editingRecord._id}`,
          updatedFormData,
        );

        showToast(response.data.message, "success");
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/hsn",
          updatedFormData,
        );
        showToast(response.data.message, "success");
      }

      fetchHsn();
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
              setAddHsn(true);
              setFormErrors(initialErrors);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-(--color-primary) rounded-lg shadow-lg active:scale-95"
          >
            + Add HSN
          </button>
        </div>
      </div>

      <BasicTable
        page="hsn"
        filteredData={filteredHsn}
        headers={tableHeaders}
        onEdit={handleEdit}
        onDelete={handleDelete}
        noView={true}
      />

      {addHsn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">
              {editingRecord ? "Edit HSN" : "Add HSN"}
            </h2>
            <HsnForm
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
