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
import { Image as AntImage, Select } from "antd";
import FormCard from "../../components/form/form-ui/FormCard.jsx";

const ViewCoupons = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const dispatch = useAppDispatch();
  const [brandName, setBrandName] = useState();
  const [couponToCustomers, setCouponToCustomers] = useState([]);

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
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (loading) return;
    axios
      .get(`http://localhost:3000/api/brands/${formData.brandId}`)
      .then((res) => {
        const data = res.data.data;
        setBrandName(data.brandName);
      })
      .catch((err) => console.error(err));
  }, [formData?.brandId]);

  useEffect(() => {
    if (loading || !formData?.couponToCustomers?.length) return;

    const idParams = formData.couponToCustomers.join(",");

    axios
      .get(
        `http://localhost:3000/api/${formData.couponCategory}?ids=${formData.couponToCustomers}`,
      )
      .then((res) => {
        const dataList = res.data.data;
        const names = dataList.map((item) => {
          if (formData.couponCategory === "customers")
            return item.customerFirstName;
          if (formData.couponCategory === "products") return item.productName;
          return item.categoryTitle;
        });
        setCouponToCustomers(names.join(", "));
      })
      .catch((err) => console.error(err));
  }, [formData?.couponToCustomers]);

  console.log(formData);
  if (loading)
    return <div className="p-6 text-sm text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <form className="space-y-6">
          <FormCard title="Offer Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Name Brand</p>
                <p className="font-medium text-lg">{brandName || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Coupon Name</p>
                <p className="font-medium text-lg">
                  {formData.couponName || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Coupon Description</p>
                <p className="font-medium text-lg">
                  {formData.couponDescription || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Coupon Code</p>
                <p className="font-medium text-lg">
                  {formData.couponCode || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Offer Value</p>
                <p className="font-medium text-lg">
                  {formData.couponMethod === "amount"
                    ? `₹ ${formData.couponValue}`
                    : `${formData.couponValue} %`}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Coupon Validity</p>
                <p className="font-medium text-lg">
                  {formData.couponValidity.from || "-"} -{" "}
                  {formData.couponValidity.to || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Coupon Category</p>
                <p className="font-medium text-lg">
                  {formData.couponCategory || "-"}
                </p>
              </div>
              {formData.couponCategory === "customers" && (
                <div>
                  <p className="text-sm text-gray-500">Coupon To Customers</p>
                  <p className="font-medium text-lg">
                    {couponToCustomers || "-"}
                  </p>
                </div>
              )}
              {formData.couponCategory === "greaterThan" && (
                <div>
                  <p className="text-sm text-gray-500">
                    Coupon To Greater Than
                  </p>
                  <p className="font-medium text-lg">
                    {formData.couponValueGreaterThan || "-"}
                  </p>
                </div>
              )}
            </div>
          </FormCard>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/coupons")}
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

export default ViewCoupons;
