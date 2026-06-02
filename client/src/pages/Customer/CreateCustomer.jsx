import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import CustomerForm from "../../components/form/CustomerForm";
import { validate } from "../../utils/customerValidation.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { fetchCompanies } from "../../features/company/companySlice";
import { selectSelectedCompany } from "../../features/company/companySelectors";

const initialState = {
  companyId: "",
  brandId: "",
  customerFirstName: "",
  customerLastName: "",
  customerEmail: "",
  customerMobileCountryCode: "",
  customerMobile: "",
  customerDateOfBirth: "",
  customerGST: "",
  customerZipcode: "",
  customerCountry: "",
  customerState: "",
  customerDistrict: "",
  customerCity: "",
  customerLandmark: "",
  customerShippingAddressLine1: "",
  customerShippingAddressLine2: "",
  customerBillingAddressLine1: "",
  customerBillingAddressLine2: "",
  addedFrom: "",
};

const CreateCustomer = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [brands, setBrands] = useState([]);
  const selectedCompany = useAppSelector(selectSelectedCompany);

  const dispatch = useAppDispatch();

  //useEffect
  useEffect(() => {
    // Fetch brands for company
    if (!selectedCompany)
      return () => {
        setBrands([]);
      };
    axios
      .get(`http://localhost:3000/api/brands?companyId=${selectedCompany._id}`)
      .then((res) => setBrands(res.data.data))
      .catch((err) => console.error("Error fetching brands", err));

    return () => {
      setBrands([]);
    };
  }, [selectedCompany?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      let payload = { ...formData, companyId: selectedCompany._id };

      const response = await axios.post(
        "http://localhost:3000/api/customers",
        payload,
      );
      dispatch(fetchCompanies());
      showToast(response.data.message, "success");
      navigate("/customer");
    } catch (err) {
      console.log("Status:", err.response?.status);
      console.log("Server message:", err.response?.data);
      let message =
        err.response?.data?.message ||
        err.message ||
        "Failed to create a customer";
      showToast(message, "error");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <CustomerForm
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          brands={brands}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/customer")}
          submitLabel="Create Customer"
        />
      </div>
    </div>
  );
};

export default CreateCustomer;
