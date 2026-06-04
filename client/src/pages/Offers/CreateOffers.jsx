import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import OfferForm from "../../components/form/OfferForm";
import { validate } from "../../utils/offerValidation.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { fetchCompanies } from "../../features/company/companySlice";
import { useAppSelector } from "../../hooks/reduxHooks";
import { selectSelectedCompany } from "../../features/company/companySelectors";

const initialState = {
  companyId: "",
  brandId: "",
  offerName: "",
  offerBanner: "",
  offerValue: "",
  offerMethod: "",
  offerValidity: { from: "", to: "" },
  offerCategory: "",
  offerTo: "",
};

const CreateOffers = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [brands, setBrands] = useState([]);
  const [offerTo, setOfferTo] = useState([]);
  const [bannerFile, setBannerFile] = useState(null);
  const selectedCompany = useAppSelector(selectSelectedCompany);

  const dispatch = useAppDispatch();

  //useEffect
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
    if (!formData.brandId) {
      setFormData((prev) => ({
        ...prev,
        offerTo: [],
      }));
      return setOfferTo([]);
    }
    if (!formData.offerCategory) {
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
    console.log(offerTo);

    return () => {
      setOfferTo([]);
    };
  }, [formData.offerCategory, formData?.brandId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
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
      const response = await axios.post(
        "http://localhost:3000/api/offers",
        payload,
      );
      dispatch(fetchCompanies());
      showToast(response.data.message, "success");
      navigate("/offers");
    } catch (err) {
      console.log("Status:", err.response?.status);
      console.log("Server message:", err.response?.data);
      let message =
        err.response?.data?.message ||
        err.message ||
        "Failed to create a offer";
      showToast(message, "error");
    }
  };

  // console.log(brands);

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
          submitLabel="Create Offer"
        />
      </div>
    </div>
  );
};

export default CreateOffers;
