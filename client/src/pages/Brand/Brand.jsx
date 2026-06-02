import React, { useState, useEffect } from "react";
import { NavLink } from "react-router";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { useToast } from "../../context/ToastContext.jsx";
import BasicTable from "../../components/tables/BasicTable/BasicTable";

import { useAppSelector } from "../../hooks/reduxHooks";
import { selectSelectedCompany } from "../../features/company/companySelectors";

const Brand = () => {
  const { showToast } = useToast();
  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCompany = useAppSelector(selectSelectedCompany);

  useEffect(() => {
    const fetchBrands = async () => {
      if (!selectedCompany) {
        setBrands([]);
        return;
      }
      try {
        const res = await axios.get(
          `http://localhost:3000/api/brands?companyId=${selectedCompany._id}`,
        );
        setBrands(res.data.data);
      } catch (err) {
        console.error("Error fetching brands", err);
      }
    };
    fetchBrands();
    return () => setBrands([]);
  }, [selectedCompany?._id]);

  const tableHeaders = [
    ["brandName", "Brand Name"],
    ["brandEmail", "Email Address"],
  ];

  const filteredBrands = brands.filter(
    (brand) =>
      brand.brandName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.brandEmail?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/brands/${id}`,
      );
      setBrands((prev) => prev.filter((brand) => brand._id !== id));

      showToast(response.data.message, "success");
    } catch (err) {
      showToast(response.data.message, "error");
    }
  };

  const exportCSV = () => {
    const headers = [
      "Brand Name",
      "Email",
      "Mobile",
      "Website",
      "GST Number",
      "Country",
      "State",
    ];
    const rows = brands.map((brand) => [
      brand.brandName,
      brand.brandEmail,
      brand.brandMobile,
      brand.website,
      brand.gstNumber,
      brand.country,
      brand.state,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell ?? ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "brands.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="">
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
            <span>CSV</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <NavLink to="/brand/create">
            <button className="px-4 py-2 text-sm font-medium text-white bg-(--color-primary) rounded-lg shadow-lg active:scale-95">
              + Add Brand
            </button>
          </NavLink>
        </div>
      </div>

      <BasicTable
        page="brand"
        filteredData={filteredBrands}
        headers={tableHeaders}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Brand;
