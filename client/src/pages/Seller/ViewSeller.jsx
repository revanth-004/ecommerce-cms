import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";

const ViewSeller = () => {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/sellers/${id}`);
        setSeller(res.data.data);
      } catch (err) {
        console.error("Error fetching Sellers", err);
      }
    };
    fetchSeller();
  }, [id]);

  if (!seller) return <div>Loading...</div>;

  return (
    <div className="">
      <div className="grid grid-cols-1 gap-4">
        {/* seller Details */}
        <div className="bg-(--bg-card) border border-(--border-color) rounded-xl p-5">
          <h3 className="text-lg font-bold mb-2 pb-2">Seller Details</h3>
          <div className="grid grid-cols-2">
            {[
              ["Seller Name", seller.sellerName],
              ["Seller Email", seller.sellerEmail],
              [
                "Phone",
                `${seller.sellerMobileCountryCode || ""} ${seller.sellerMobile || ""}`,
              ],
              ["Website", seller.sellerWebsite],
              ["GST Number", seller.sellerGST],
              ["Zipcode", seller.sellerZipcode],
              ["Country", seller.sellerCountry],
              ["State", seller.sellerState],
              ["District", seller.sellerDistrict],
              ["Seller Address", seller.sellerAddress],
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
            {seller.sellerLogo && (
              <div className="flex items-start gap-3 py-2.5 col-span-2">
                <div>
                  <p className="text-xs text-(--text-muted) mb-0.5">
                    seller Logo
                  </p>
                  <img
                    src={`http://localhost:3000${seller.sellerLogo}`}
                    alt="seller Logo"
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
            {seller.communicationEmails?.length > 0 ? (
              seller.communicationEmails.map((email, index) => (
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

export default ViewSeller;
