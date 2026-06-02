import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import SellerForm from "../../components/form/SellerForm";
import { validate } from "../../utils/sellerValidation.js";

import { useAppSelector } from "../../hooks/reduxHooks";
import { selectSelectedCompany } from "../../features/company/companySelectors";
import { useToast } from "../../context/ToastContext.jsx";

const initialState = {
  sellerName: "",
  sellerEmail: "",
  sellerMobileCountryCode: "",
  sellerMobile: "",
  sellerWebsite: "",
  sellerGST: "",
  sellerZipcode: "",
  sellerCountry: "",
  sellerState: "",
  sellerDistrict: "",
  sellerCity: "",
  sellerAddress: "",
  sellerLogo: "",
  communicationEmails: [],
};

const CreateSeller = () => {
  const { showToast } = useToast();
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
        updatedFormData.sellerLogo = res.data.filePath;
      }
      const response = await axios.post(
        "http://localhost:3000/api/sellers",
        updatedFormData,
      );

      showToast(response.data.message, "success");
      navigate("/seller");
    } catch (err) {
      console.log("Status:", err.response?.status);
      console.log("Server message:", err.response?.data);
      let message =
        err.response?.data?.message ||
        err.message ||
        "Failed to create a seller";

      if (message.includes("E11000")) {
        if (message.includes("sellerEmail"))
          message = "Seller email already exists";
        else if (message.includes("sellerMobile"))
          message = "Mobile number already exists";
        else message = "A record with this data already exists";
      }

      showToast(message, "error");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <SellerForm
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          logoFile={logoFile}
          setLogoFile={setLogoFile}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/seller")}
          submitLabel="Create Seller"
        />
      </div>
    </div>
  );
};

export default CreateSeller;
