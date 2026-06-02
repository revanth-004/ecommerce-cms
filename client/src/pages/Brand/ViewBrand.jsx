import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";

const ViewBrand = () => {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/brands/${id}`);
        setBrand(res.data.data);
      } catch (err) {
        console.error("Error fetching Brands", err);
      }
    };
    fetchBrand();
  }, [id]);

  if (!brand) return <div>Loading...</div>;

  return (
    <div className="">
      <div className="grid grid-cols-1 gap-4">
        {/* brand Details */}
        <div className="bg-(--bg-card) border border-(--border-color) rounded-xl p-5">
          <h3 className="text-lg font-bold mb-2 pb-2">Brand Details</h3>
          <div className="grid grid-cols-2">
            {[
              ["Brand Name", brand.brandName],
              ["Brand Email", brand.brandEmail],
              [
                "Phone",
                `${brand.brandMobileCountryCode || ""} ${brand.brandMobile || ""}`,
              ],
              ["Website", brand.brandWebsite],
              ["GST Number", brand.brandGST],
              ["Zipcode", brand.brandZipcode],
              ["Country", brand.brandCountry],
              ["State", brand.brandState],
              ["District", brand.brandDistrict],
              ["Brand Address", brand.brandAddress],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start gap-3 py-2.5">
                <div>
                  <p className="text-xs text-(--text-muted) mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-(--text-secondary)">
                    {value || "—"}
                  </p>
                </div>
              </div>
            ))}

            {/* Logo */}
            {brand.brandLogo && (
              <div className="flex items-start gap-3 py-2.5 col-span-2">
                <div>
                  <p className="text-xs text-(--text-muted) mb-0.5">
                    brand Logo
                  </p>
                  <img
                    src={`http://localhost:3000${brand.brandLogo}`}
                    alt="brand Logo"
                    className="h-10 object-contain border border-(--border-color) rounded p-1 mt-1"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Communication Emails */}
        <div className="bg-(--bg-card) border border-(--border-color) rounded-xl p-5">
          <h3 className="text-lg font-bold mb-2 pb-2">Communication Emails</h3>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {brand.communicationEmails?.length > 0 ? (
              brand.communicationEmails.map((email, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-sm font-medium border border-(--border-color) rounded-md"
                >
                  {email}
                </span>
              ))
            ) : (
              <span className="text-sm text-(--text-muted)">—</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBrand;
