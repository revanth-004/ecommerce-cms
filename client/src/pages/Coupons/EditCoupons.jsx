import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import CouponForm from "../../components/form/CouponForm";
import { validate } from "../../utils/couponValidation.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { fetchCompanies } from "../../features/company/companySlice";
import { useAppSelector } from "../../hooks/reduxHooks";
import { selectSelectedCompany } from "../../features/company/companySelectors";

const EditCoupons = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [brands, setBrands] = useState([]);
  const [couponToCustomers, setCouponToCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedCompany = useAppSelector(selectSelectedCompany);

  const dispatch = useAppDispatch();

  //useEffect
  useEffect(() => {
    //Initial FormData Fetch
    axios
      .get(`http://localhost:3000/api/coupons/${id}`)
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
    if (!formData?.brandId) {
      setFormData((prev) => ({
        ...prev,
        couponToCustomers: [],
      }));
      return setCouponToCustomers([]);
    }
    if (!formData?.couponCategory) {
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
      // .get(`http://localhost:3000/api/${formData.couponCategory}`)
      .then((res) => setCouponToCustomers(res.data.data))
      .catch((err) => console.error("Error fetching customer", err));

    return () => {
      setCouponToCustomers([]);
    };
  }, [formData?.couponCategory, formData?.brandId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      let payload = { ...formData, companyId: selectedCompany?._id };

      const response = await axios.put(
        `http://localhost:3000/api/coupons/${id}`,
        payload,
      );
      dispatch(fetchCompanies());
      showToast(response.data.message, "success");
      navigate("/coupons");
    } catch (err) {
      console.log("Status:", err.response?.status);
      console.log("Server message:", err.response?.data);
      let message =
        err.response?.data?.message || err.message || "Failed to Edit a coupon";
      showToast(message, "error");
    }
  };

  // console.log(brands);
  if (loading)
    return <div className="p-6 text-sm text-gray-400">Loading...</div>;

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
          submitLabel="Edit Coupon"
        />
      </div>
    </div>
  );
};

export default EditCoupons;
