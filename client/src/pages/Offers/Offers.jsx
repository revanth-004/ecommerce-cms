import React, { useState, useEffect } from "react";
import { NavLink } from "react-router";
import axios from "axios";
import { useToast } from "../../context/ToastContext.jsx";
import BasicTable from "../../components/tables/BasicTable/BasicTable";

import { useAppSelector } from "../../hooks/reduxHooks";
import { selectSelectedCompany } from "../../features/company/companySelectors";

const Offers = () => {
  const { showToast } = useToast();
  const [offers, setOffers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCompany = useAppSelector(selectSelectedCompany);

  const tableHeaders = [
    ["offerName", "Offer Name"],
    ["offerValidity", "Validity"],
  ];

  const filteredOffers = offers.filter(
    (cus) =>
      cus.offerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cus.offerEmail?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/offers?companyId=${selectedCompany._id}`,
        );
        setOffers(res.data.data);
      } catch (err) {
        console.error("Error fetching offers", err);
      }
    };
    fetchOffers();
  }, [selectedCompany?._id]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/offers/${id}`,
      );
      setOffers((prev) => prev.filter((cus) => cus._id !== id));
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
          <NavLink to="/offers/create">
            <button className="px-4 py-2 text-sm font-medium text-white bg-(--color-primary) rounded-lg shadow-lg active:scale-95">
              + Add Offer
            </button>
          </NavLink>
        </div>
      </div>

      <BasicTable
        page="offers"
        filteredData={filteredOffers}
        headers={tableHeaders}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Offers;
