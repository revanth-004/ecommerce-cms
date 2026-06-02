import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import PageBreadCrumbs from "./PageBreadCrumbs";
import axios from "axios";
import Dropdown from "react-dropdown";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {
  fetchCompanies,
  setSelectedCompany,
} from "../features/company/companySlice";
import {
  selectAllCompanies,
  selectSelectedCompany,
  selectCompanyStatus,
} from "../features/company/companySelectors";

const AppHeader = () => {
  const { isDark, toggleTheme } = useTheme();
  // const [companies, setCompanies] = useState([]);
  // const [selectedCompany, setSelectedCompany] = useState(null);

  // useEffect(() => {
  //   const fetchCompanies = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:3000/api/organizers");
  //       const formattedData = res.data.data.map((item) => ({
  //         value: item.adminEmail,
  //         label: item.adminName,
  //       }));
  //       setCompanies(formattedData);
  //     } catch (err) {
  //       console.error("Error fetching organizers", err);
  //     }
  //   };
  //   fetchCompanies();
  // }, []);

  // const handleSelect = (option) => {
  //   console.log("Selected:", option);
  //   setSelectedCompany(option);
  // };
  const dispatch = useAppDispatch();

  const companies = useAppSelector(selectAllCompanies);
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const status = useAppSelector(selectCompanyStatus);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCompanies()); // only fetch once
    }
  }, [status, dispatch]);

  const handleSelect = (e) => {
    const company = companies.find((c) => c._id === e.target.value);
    dispatch(setSelectedCompany(company));
  };

  return (
    <div className="sticky top-4 z-40 max:w-full h-18 p-8 rounded-xl border border-(--border-color) mt-4 mx-12 bg-white/10 backdrop-blur-xl flex justify-between items-center">
      <PageBreadCrumbs />
      <div className="flex gap-4 items-center">
        <select
          value={selectedCompany?._id || " "}
          onChange={handleSelect}
          disabled={status === "loading"}
          className="min-w-50 px-3 py-1.5 text-sm border border-(--border-color) rounded-md bg-(--bg-input) text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            Select a company
          </option>
          {companies.map((c) => (
            <option key={c._id} value={c._id}>
              {c.companyName}
            </option>
          ))}
        </select>

        <button
          onClick={toggleTheme}
          className="btn-secondary flex items-center gap-2 px-3 py-1.5 text-sm"
        >
          {isDark ? "Light" : "Dark"}
        </button>
      </div>
    </div>
  );
};

export default AppHeader;
