import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useToast } from "../../context/ToastContext.jsx";
import BasicTable from "../../components/tables/BasicTable/BasicTable";

import { useAppSelector } from "../../hooks/reduxHooks";
import { selectSelectedCompany } from "../../features/company/companySelectors";

const Articles = () => {
  const { showToast } = useToast();
  const [articles, setArticles] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const tableHeaders = [["articleTitle", "Article Title"]];

  const filteredArticles = articles?.filter((art) =>
    art.articleTitle?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/article?companyId=${selectedCompany._id}`,
        );
        setArticles(res.data.data);
      } catch (err) {
        console.error("Error fetching articles", err);
      }
    };
    fetchArticles();
  }, [selectedCompany?._id]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/article/${id}`,
      );
      setArticles((prev) => prev.filter((cus) => cus._id !== id));
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
          <NavLink to="/articles/create">
            <button className="px-4 py-2 text-sm font-medium text-white bg-(--color-primary) rounded-lg shadow-lg active:scale-95">
              + Add Article
            </button>
          </NavLink>
        </div>
      </div>

      <BasicTable
        page="articles"
        filteredData={filteredArticles}
        headers={tableHeaders}
        onDelete={handleDelete}
        noView={true}
      />
    </div>
  );
};

export default Articles;
