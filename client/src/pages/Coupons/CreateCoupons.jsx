import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import CouponForm from "../../components/form/CouponForm";
import { validate } from "../../utils/couponValidation.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { fetchCompanies } from "../../features/company/companySlice";
import { useAppSelector } from "../../hooks/reduxHooks";
import { selectSelectedCompany } from "../../features/company/companySelectors";

const initialState = {
  companyId: "",
  brandId: "",
  couponName: "",
  couponDescription: "",
  couponCode: "",
  couponBanner: "",
  couponValue: "",
  couponMethod: "",
  couponValidity: { from: "", to: "" },
  couponCategory: "",
  couponToCustomers: [],
  couponValueGreaterThan: "",
};

const CreateCoupons = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [brands, setBrands] = useState([]);
  const [couponToCustomers, setCouponToCustomers] = useState([]);
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
      couponToCustomers: [],
    }));
    setCouponToCustomers([]);

    axios
      .get(`http://localhost:3000/api/brands?companyId=${selectedCompany._id}`)
      .then((res) => setBrands(res.data.data))
      .catch((err) => console.error("Error fetching brands", err));

    return () => {
      setBrands([]);
    };
  }, [selectedCompany?._id]);

  useEffect(() => {
    // Fetch couponToCustomers (customers/products/productCategory)
    if (!formData.brandId) {
      setFormData((prev) => ({
        ...prev,
        couponToCustomers: [],
      }));
      return setCouponToCustomers([]);
    }
    if (!formData.couponCategory) {
      return setCouponToCustomers([]);
    }
    setFormData((prev) => ({
      ...prev,
      couponToCustomers: [],
    }));
    axios
      .get(
        `http://localhost:3000/api/${formData.couponCategory}?brandId=${formData.brandId}`,
      )
      // .get(`http://localhost:3000/api/${formData.offerCategory}`)
      .then((res) => setCouponToCustomers(res.data.data))
      .catch((err) => console.error("Error fetching customer", err));
    console.log(couponToCustomers);

    return () => {
      setCouponToCustomers([]);
    };
  }, [formData.couponCategory, formData?.brandId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const errors = validate(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      let payload = { ...formData, companyId: selectedCompany?._id };
      //   if (bannerFile) {
      //     const uploadFile = new FormData();
      //     uploadFile.append("file", bannerFile);
      //     const res = await axios.post(
      //       "http://localhost:3000/upload",
      //       uploadFile,
      //     );
      //     payload.couponBanner = res.data.filePath;
      //   }
      const response = await axios.post(
        "http://localhost:3000/api/coupons",
        payload,
      );
      dispatch(fetchCompanies());
      showToast(response.data.message, "success");
      navigate("/coupons");
    } catch (err) {
      console.log("Status:", err.response?.status);
      console.log("Server message:", err.response?.data);
      let message =
        err.response?.data?.message ||
        err.message ||
        "Failed to create a coupon";
      showToast(message, "error");
    }
  };

  // console.log(brands);

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <CouponForm
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          brands={brands}
          couponToCustomers={couponToCustomers}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/coupons")}
          submitLabel="Create Coupon"
        />
      </div>
    </div>
  );
};

export default CreateCoupons;
