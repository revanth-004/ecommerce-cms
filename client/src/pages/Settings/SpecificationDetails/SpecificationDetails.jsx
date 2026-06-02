import React from "react";
import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { useAppSelector } from "../../../hooks/reduxHooks";
import { selectSelectedCompany } from "../../../features/company/companySelectors";
import SpecificationDetailForm from "../../../components/form/SpecificationDetailForm";
import { Table, Space, Popconfirm, Button, Image } from "antd";
import axios from "axios";

import BasicTable from "../../../components/tables/BasicTable/BasicTable";
import { useToast } from "../../../context/ToastContext";

const initialState = {
  companyId: "",
  brandId: "",
  specificationId: "",
  specificationDetail: "",
};
const initialErrors = {
  brandId: "",
  specificationId: "",
  specificationDetail: "",
};

const SpecificationDetail = () => {
  const { showToast } = useToast();
  const [specifications, setSpecifications] = useState([]); //Form
  const [allSpecifications, setAllSpecifications] = useState([]); // Table
  const [specificationDetails, setSpecificationDetails] = useState([]);
  const [addSpecificationDetail, setAddSpecificationDetail] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [formErrors, setFormErrors] = useState(initialErrors);
  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCompany = useAppSelector(selectSelectedCompany);

  const [editingRecord, setEditingRecord] = useState(null);

  const exportCSV = () => {
    const headers = ["SpecificationDetail Name", "Brand"];
    const rows = specificationDetails.map((specificationDetail) => [
      specificationDetail.specificationDetailName,
      brands.find((b) => b._id === specificationDetail.brandId)?.brandName ||
        specificationDetail.brandId,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell ?? ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "SpecificationDetail.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const fetchSpecificationDetail = async () => {
    if (!selectedCompany) return;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/specificationDetail?companyId=${selectedCompany._id}`,
      );
      setSpecificationDetails(res.data.data);
    } catch (err) {
      console.error("Error fetching SpecificationDetail", err);
    }
  };

  const handleEdit = (record) => {
    // const brandSpecifications = allSpecifications.filter(
    //   (sp) => sp.brandId === record.brandId,
    // );
    // setSpecifications(brandSpecifications);
    const rec = specificationDetails.find((s) => s._id === record);
    setFormData({
      companyId: rec.companyId,
      brandId: rec.brandId,
      specificationId: rec.specificationId,
      specificationDetail: rec.specificationDetail,
    });
    setEditingRecord(rec);
    setAddSpecificationDetail(true);
  };

  const handleClose = () => {
    setAddSpecificationDetail(false);
    setFormData(initialState);
    setFormErrors(initialErrors);
    setEditingRecord(null);
    setSpecifications([]);
  };

  useEffect(() => {
    if (!selectedCompany) {
      setBrands([]);
      setSpecificationDetails([]);
      return;
    }

    // Fetch brands
    axios
      .get(`http://localhost:3000/api/brands?companyId=${selectedCompany._id}`)
      .then((res) => setBrands(res.data.data))
      .catch((err) => console.error("Error fetching brands", err));

    // Fetch All specification
    axios
      .get(
        `http://localhost:3000/api/specification?companyId=${selectedCompany._id}`,
      )
      .then((res) => {
        setAllSpecifications(res.data.data);
      })
      .catch((err) => console.error("Error fetching specifications", err));

    // Fetch specificationDetails
    fetchSpecificationDetail();

    return () => {
      setBrands([]);
    };
  }, [selectedCompany?._id]);

  useEffect(() => {
    if (!formData.brandId) return setSpecifications([]);

    axios
      .get(
        `http://localhost:3000/api/specification?brandId=${formData.brandId}`,
      )
      .then((res) => {
        setSpecifications(res.data.data);
      })
      .catch((err) => console.error("Error fetching specifications", err));

    return () => setSpecifications([]);
  }, [formData.brandId]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/specificationDetail/${id}`,
      );

      showToast(response.data.message, "success");
      fetchSpecificationDetail();
    } catch (err) {
      console.error("Delete error", err);
      showToast(response.data.message, "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.brandId) errors.brandId = "Brand is required";
    if (!formData.specificationId)
      errors.specificationId = "Specification is required"; // ← add this
    if (!formData.specificationDetail)
      errors.specificationDetail = "Specification detail is required";

    if (Object.keys(errors).length) {
      setFormErrors((prev) => ({ ...prev, ...errors }));
      return;
    }

    try {
      let updatedFormData = { ...formData, companyId: selectedCompany._id };

      if (editingRecord) {
        const response = await axios.put(
          `http://localhost:3000/api/specificationDetail/${editingRecord._id}`,
          updatedFormData,
        );
        showToast(response.data.message, "success");
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/specificationDetail",
          updatedFormData,
        );
        showToast(response.data.message, "success");
      }

      fetchSpecificationDetail();
      handleClose();
    } catch (err) {
      console.log("Status:", err.response?.status);
      console.log("Server message:", err.response?.data);
      showToast(response.data.message, "error");
    }
  };

  const tableHeaders = [
    ["specificationDetail", "Specification Detail"],
    ["specificationName", "Specification"],
    ["brandName", "Brand"],
  ];
  const specificationDetailWithNames = specificationDetails.map((s) => ({
    ...s,
    brandName: brands.find((b) => b._id === s.brandId)?.brandName || s.brandId,
    specificationName:
      allSpecifications.find((sp) => sp._id === s.specificationId)
        ?.specificationName || s.specificationId,
  }));

  const filteredSpecificationDetails = specificationDetailWithNames.filter(
    (sd) =>
      sd.specificationDetail?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
            setFormData(initialState);
            setFormErrors(initialErrors);
            setSpecifications([]);
            setAddSpecificationDetail(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-(--color-primary) rounded-lg shadow-lg active:scale-95"
        >
          + Add Specification Detail
        </button>
      </div>
      <div className="">
        <BasicTable
          page="tax"
          filteredData={filteredSpecificationDetails}
          headers={tableHeaders}
          onEdit={handleEdit}
          onDelete={handleDelete}
          noView={true}
        />
      </div>
      {addSpecificationDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">
              {editingRecord
                ? "Edit Specification Detail"
                : "Add Specification Detail"}
            </h2>
            <SpecificationDetailForm
              formData={formData}
              setFormData={setFormData}
              formErrors={formErrors}
              setFormErrors={setFormErrors}
              brands={brands}
              specifications={specifications}
              onSubmit={handleSubmit}
              onCancel={handleClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecificationDetail;
