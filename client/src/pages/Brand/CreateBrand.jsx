import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import BrandForm from "../../components/form/BrandForm";
import { validate } from "../../utils/brandValidation.js";
import CheckIcon from "@mui/icons-material/Check";
import { useAppSelector } from "../../hooks/reduxHooks";
import { selectSelectedCompany } from "../../features/company/companySelectors";

import { useToast } from "../../context/ToastContext.jsx";

const initialState = {
  brandName: "",
  brandEmail: "",
  brandMobileCountryCode: "",
  brandMobile: "",
  brandWebsite: "",
  brandGST: "",
  brandZipcode: "",
  brandCountry: "",
  brandState: "",
  brandDistrict: "",
  brandCity: "",
  brandAddress: "",
  brandLogo: "",
  communicationEmails: [],
};

const CreateBrand = () => {
  const { showToast } = useToast;
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [logoFile, setLogoFile] = useState(null);

  const selectedCompany = useAppSelector(selectSelectedCompany);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      let updatedFormData = { ...formData, companyId: selectedCompany._id };
      if (logoFile) {
        const uploadData = new FormData();
        uploadData.append("file", logoFile);
        const res = await axios.post(
          "http://localhost:3000/upload",
          uploadData,
        );
        updatedFormData.brandLogo = res.data.filePath;
      }
      const response = await axios.post(
        "http://localhost:3000/api/brands",
        updatedFormData,
      );

      showToast(response.message, "success");
      navigate("/brand");
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
      // showToast(message, "error");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <BrandForm
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          logoFile={logoFile}
          setLogoFile={setLogoFile}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/brand")}
          submitLabel="Create Brand"
        />
      </div>
    </div>
  );
};

export default CreateBrand;
