import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import BrandForm from "../../components/form/BrandForm";
import { validate } from "../../utils/brandValidation.js";
import CheckIcon from "@mui/icons-material/Check";
import { useToast } from "../../context/ToastContext.jsx";
import { useAppSelector } from "../../hooks/reduxHooks";
import { selectSelectedCompany } from "../../features/company/companySelectors";

const EditBrand = () => {
  const { showToast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const selectedCompany = useAppSelector(selectSelectedCompany);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/brands/${id}`)
      .then((res) => {
        const data = res.data;
        // console.log("brandLogo from DB:", data.brandLogo);
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
      const response = await axios.put(
        `http://localhost:3000/api/brands/${id}`,
        updatedFormData,
      );

      showToast(response.data.message, "success");
      navigate("/brand");
    } catch (err) {
      showToast(response.data.message, "error");
    }
  };

  if (loading)
    return <div className="p-6 text-sm text-gray-400">Loading...</div>;

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
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
};

export default EditBrand;
