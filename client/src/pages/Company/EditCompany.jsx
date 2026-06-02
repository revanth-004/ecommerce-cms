import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import CompanyForm from "../../components/form/CompanyForm";
import { validate } from "../../utils/companyValidation.js";

import { useToast } from "../../context/ToastContext.jsx";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { fetchCompanies } from "../../features/company/companySlice";

const EditCompany = () => {
  const { showToast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/organizers/${id}`)
      .then((res) => {
        const data = res.data;
        console.log("companyLogo from DB:", data.companyLogo);
        setFormData(res.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

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
      const response = await axios.put(
        `http://localhost:3000/api/organizers/${id}`,
        updatedFormData,
      );
      dispatch(fetchCompanies());
      showToast(response.data.message, "success");
      navigate("/company");
    } catch (err) {
      showToast(response.data.message, "error");
    }
  };

  if (loading)
    return <div className="p-6 text-sm text-gray-400">Loading...</div>;

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
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
};

export default EditCompany;
