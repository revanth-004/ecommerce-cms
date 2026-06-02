import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import FormCard from "../../components/form/form-ui/FormCard";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { fetchCompanies } from "../../features/company/companySlice";
import dayjs from "dayjs";

const ViewCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);

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

  console.log(formData);
  if (loading)
    return <div className="p-6 text-sm text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <form className="space-y-6">
          <FormCard title="Customer Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Customer First Name</p>
                <p className="font-medium text-lg">
                  {formData.customerFirstName || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer Last Name</p>
                <p className="font-medium text-lg">
                  {formData.customerLastName || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{formData.customerEmail || "-"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Mobile Number</p>
                <p className="font-medium">
                  {formData.customerMobileCountryCode}{" "}
                  {formData.customerMobile || "-"}
                </p>
              </div>

              {/* Date of Birth */}
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">
                  {formData.customerDateOfBirth
                    ? dayjs(formData.customerDateOfBirth).format("DD-MM-YYYY")
                    : "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">GST Number</p>
                <p className="font-medium">{formData.customerGST || "-"}</p>
              </div>

              {/* Addresses */}
              <div className="">
                <h4 className="font-semibold text-lg mb-3">Billing Address</h4>
                <div className="bg-gray-50 p-4 rounded-lg ">
                  <p>{formData.customerBillingAddressLine1}</p>
                  <p>{formData.customerBillingAddressLine2}</p>
                  <p>
                    {formData.customerDistrict}, {formData.customerState},{" "}
                    {formData.customerCountry}
                  </p>
                  <p>Zipcode: {formData.customerZipcode}</p>
                </div>
              </div>

              <div className="">
                <h4 className="font-semibold text-lg mb-3">Shipping Address</h4>
                <div className="bg-gray-50 p-4 rounded-lg ">
                  <p>{formData.customerShippingAddressLine1}</p>
                  <p>{formData.customerShippingAddressLine2}</p>
                  <p>
                    {formData.customerDistrict}, {formData.customerState},{" "}
                    {formData.customerCountry}
                  </p>
                  <p>Zipcode: {formData.customerZipcode}</p>
                </div>
              </div>

              {/* Other Details */}

              <div>
                <p className="text-sm text-gray-500"> Landmark</p>
                <p className="font-medium ">
                  {formData.customerLandmark || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Added From</p>
                <p className="font-medium capitalize">
                  {formData.addedFrom || "-"}
                </p>
              </div>
            </div>
          </FormCard>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/customer")}
              className="px-6 py-2 text-white bg-(--color-primary) border border-(--border-color) rounded-md font-medium"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViewCustomer;
