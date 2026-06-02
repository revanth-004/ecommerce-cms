import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import CompanyForm from "../../components/form/CompanyForm";
import { validate } from "../../utils/companyValidation.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { fetchCompanies } from "../../features/company/companySlice";

const initialState = {
  companyName: "",
  companyEmail: "",
  companyMobileCountryCode: "",
  companyMobile: "",
  companyWebsite: "",
  companyGST: "",
  companyZipcode: "",
  companyCountry: "",
  companyState: "",
  companyDistrict: "",
  companyCity: "",
  companyAddress: "",
  companyLogo: "",
  adminName: "",
  adminEmail: "",
  adminMobileCountryCode: "",
  adminMobile: "",
  adminPassword: "",
  projectModules: [],
  communicationEmails: [],
};

const CreateCompany = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [logoFile, setLogoFile] = useState(null);

  const dispatch = useAppDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      let updatedFormData = { ...formData };
      if (logoFile) {
        const uploadData = new FormData();
        uploadData.append("file", logoFile);
        const res = await axios.post(
          "http://localhost:3000/upload",
          uploadData,
        );
        updatedFormData.companyLogo = res.data.filePath;
      }
      const response = await axios.post(
        "http://localhost:3000/api/organizers",
        updatedFormData,
      );
      dispatch(fetchCompanies());
      showToast(response.data.message, "success");
      navigate("/company");
    } catch (err) {
      console.log("Status:", err.response?.status);
      console.log("Server message:", err.response?.data);
      let message =
        err.response?.data?.message ||
        err.message ||
        "Failed to create a company";

      if (message.includes("E11000")) {
        if (message.includes("companyEmail"))
          message = "Company email already exists";
        else if (message.includes("adminEmail"))
          message = "Admin email already exists";
        else if (message.includes("companyMobile"))
          message = "Mobile number already exists";
        else message = "A record with this data already exists";
      }
      showToast(message, "error");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <CompanyForm
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          logoFile={logoFile}
          setLogoFile={setLogoFile}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/company")}
          submitLabel="Create Company"
        />
      </div>
    </div>
  );
};

export default CreateCompany;
