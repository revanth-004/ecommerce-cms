import React, { useState, useEffect } from "react";
import { NavLink } from "react-router";
import axios from "axios";
import { useToast } from "../../context/ToastContext.jsx";
import BasicTable from "../../components/tables/BasicTable/BasicTable";

import { useAppSelector } from "../../hooks/reduxHooks";
import { selectSelectedCompany } from "../../features/company/companySelectors";

const Coupons = () => {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCompany = useAppSelector(selectSelectedCompany);

  const tableHeaders = [
    ["couponName", "Coupon Name"],
    ["couponDescription", "Description"],
  ];

  const filteredCoupons = coupons.filter(
    (cus) =>
      cus.couponName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cus.couponEmail?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/coupons?companyId=${selectedCompany._id}`,
        );
        setCoupons(res.data.data);
      } catch (err) {
        console.error("Error fetching coupons", err);
      }
    };
    fetchCoupons();
  }, [selectedCompany?._id]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/coupons/${id}`,
      );
      setCoupons((prev) => prev.filter((cus) => cus._id !== id));
      showToast(response.data.message, "success");
    } catch (err) {
      showToast(response.data.message, "error");
    }
  };

  const exportCSV = () => {
    const headers = [
      "Company Name",
      "Email",
      "Mobile",
      "Website",
      "GST Number",
      "Country",
      "State",
    ];
    const rows = customers.map((cus) => [
      cus.customerName,
      cus.customerEmail,
      cus.customerMobile,
      cus.website,
      cus.gstNumber,
      cus.country,
      cus.state,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell ?? ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "customers.csv";
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
          <NavLink to="/coupons/create">
            <button className="px-4 py-2 text-sm font-medium text-white bg-(--color-primary) rounded-lg shadow-lg active:scale-95">
              + Add Coupon
            </button>
          </NavLink>
        </div>
      </div>

      <BasicTable
        page="coupons"
        filteredData={filteredCoupons}
        headers={tableHeaders}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Coupons;
