import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import OfferForm from "../../components/form/OfferForm";
import { validate } from "../../utils/offerValidation.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { fetchCompanies } from "../../features/company/companySlice";
import { useAppSelector } from "../../hooks/reduxHooks";
import { selectSelectedCompany } from "../../features/company/companySelectors";

const EditOffers = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [brands, setBrands] = useState([]);
  const [offerTo, setOfferTo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerFile, setBannerFile] = useState(null);
  const selectedCompany = useAppSelector(selectSelectedCompany);

  const dispatch = useAppDispatch();

  //useEffect

  useEffect(() => {
    //Initial FormData Fetch
    axios
      .get(`http://localhost:3000/api/offers/${id}`)
      .then((res) => {
        const data = res.data;
        setFormData(res.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    // Fetch brands for company
    if (!selectedCompany)
      return () => {
        setBrands([]);
      };

    setFormData((prev) => ({
      ...prev,
      brandId: "",
      offerTo: [],
    }));
    setOfferTo([]);

    axios
      .get(`http://localhost:3000/api/brands?companyId=${selectedCompany._id}`)
      .then((res) => setBrands(res.data.data))
      .catch((err) => console.error("Error fetching brands", err));

    return () => {
      setBrands([]);
    };
  }, [selectedCompany?._id]);

  useEffect(() => {
    // Fetch offerTo (customers/products/productCategory)
    if (!formData?.brandId) {
      setFormData((prev) => ({
        ...prev,
        offerTo: [],
      }));
      return setOfferTo([]);
    }
    if (!formData?.offerCategory) {
      return setOfferTo([]);
    }
    setFormData((prev) => ({
      ...prev,
      offerTo: [],
    }));
    axios
      .get(
        `http://localhost:3000/api/${formData.offerCategory}?brandId=${formData.brandId}`,
      )
      // .get(`http://localhost:3000/api/${formData.offerCategory}`)
      .then((res) => setOfferTo(res.data.data))
      .catch((err) => console.error("Error fetching customer", err));

    return () => {
      setOfferTo([]);
    };
  }, [formData?.offerCategory, formData?.brandId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      let payload = { ...formData, companyId: selectedCompany?._id };
      if (bannerFile) {
        const uploadFile = new FormData();
        uploadFile.append("file", bannerFile);
        const res = await axios.post(
          "http://localhost:3000/upload",
          uploadFile,
        );
        payload.offerBanner = res.data.filePath;
      }
      const response = await axios.put(
        `http://localhost:3000/api/offers/${id}`,
        payload,
      );
      dispatch(fetchCompanies());
      showToast(response.data.message, "success");
      navigate("/offers");
    } catch (err) {
      console.log("Status:", err.response?.status);
      console.log("Server message:", err.response?.data);
      let message =
        err.response?.data?.message || err.message || "Failed to Edit a offer";
      showToast(message, "error");
    }
  };

  // console.log(brands);
  if (loading)
    return <div className="p-6 text-sm text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <OfferForm
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          brands={brands}
          offerTo={offerTo}
          bannerFile={bannerFile}
          setBannerFile={setBannerFile}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/offers")}
          submitLabel="Edit Offer"
        />
      </div>
    </div>
  );
};

export default EditOffers;
