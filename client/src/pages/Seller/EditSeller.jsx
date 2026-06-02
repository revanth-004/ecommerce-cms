import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import SellerForm from "../../components/form/SellerForm";
import { validate } from "../../utils/sellerValidation.js";
import CheckIcon from "@mui/icons-material/Check";
import { useToast } from "../../context/ToastContext.jsx";

const EditSeller = () => {
  const { showToast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/sellers/${id}`)
      .then((res) => {
        const data = res.data;
        console.log("sellerLogo from DB:", data.sellerLogo);
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
        updatedFormData.sellerLogo = res.data.filePath;
      }
      const response = await axios.put(
        `http://localhost:3000/api/sellers/${id}`,
        updatedFormData,
      );
      showToast(response.data.message, "success");
      navigate("/seller");
    } catch (err) {
      showToast(response.data.message, "error");
    }
  };

  if (loading)
    return <div className="p-6 text-sm text-gray-400">Loading...</div>;

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
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
};

export default EditSeller;
