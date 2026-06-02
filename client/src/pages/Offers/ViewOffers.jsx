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
import { Image as AntImage, Select } from "antd";
import FormCard from "../../components/form/form-ui/FormCard.jsx";

const ViewOffers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const dispatch = useAppDispatch();
  const [brandName, setBrandName] = useState();
  const [offerTo, setOfferTo] = useState([]);
  let offerCategory = [];
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
    if (loading || !formData?.offerTo?.length) return;

    const idParams = formData.offerTo.join(",");

    axios
      .get(
        `http://localhost:3000/api/${formData.offerCategory}?ids=${formData.offerTo}`,
      )
      .then((res) => {
        const dataList = res.data.data;
        const names = dataList.map((item) => {
          if (formData.offerCategory === "customers")
            return item.customerFirstName;
          if (formData.offerCategory === "products") return item.productName;
          return item.categoryTitle;
        });
        setOfferTo(names.join(", "));
      })
      .catch((err) => console.error(err));
  }, [formData?.offerTo]);

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
                <p className="text-sm text-gray-500">Offer Name</p>
                <p className="font-medium text-lg">
                  {formData.offerName || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Offer Banner</p>
                {formData.offerBanner && (
                  <AntImage
                    src={`http://localhost:3000${formData.offerBanner}`}
                    alt="Offer Banner Preview"
                    className="rounded-lg"
                    style={{
                      width: "auto",
                      height: "100px",
                      objectFit: "contain",
                      maxWidth: "100%",
                    }}
                  />
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500">Offer Value</p>
                <p className="font-medium text-lg">
                  {formData.offerMethod === "amount"
                    ? `₹ ${formData.offerValue}`
                    : `${formData.offerValue} %`}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Offer Validity</p>
                <p className="font-medium text-lg">
                  {formData.offerValidity || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Offer Category</p>
                <p className="font-medium text-lg">
                  {formData.offerCategory || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Offer To</p>
                <p className="font-medium text-lg">{offerTo || "-"}</p>
              </div>
            </div>
          </FormCard>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/offers")}
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

export default ViewOffers;
