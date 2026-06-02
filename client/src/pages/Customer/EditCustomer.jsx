import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import CustomerForm from "../../components/form/CustomerForm";
import { validate } from "../../utils/customerValidation.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { useAppSelector } from "../../hooks/reduxHooks";
import { fetchCompanies } from "../../features/company/companySlice";
import { selectSelectedCompany } from "../../features/company/companySelectors";

const EditCustomer = () => {
  const { showToast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const selectedCompany = useAppSelector(selectSelectedCompany);

  const dispatch = useAppDispatch();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/customers/${id}`)
      .then((res) => {
        const data = res.data;
        setFormData(res.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

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
      const response = await axios.put(
        `http://localhost:3000/api/customers/${id}`,
        payload,
      );
      dispatch(fetchCompanies());
      showToast(response.data.message, "success");
      navigate("/customer");
    } catch (err) {
      showToast(response.data.message, "error");
    }
  };

  console.log(formData);
  if (loading)
    return <div className="p-6 text-sm text-gray-400">Loading...</div>;

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
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
};

export default EditCustomer;
