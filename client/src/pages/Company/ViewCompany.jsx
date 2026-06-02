import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";

const ViewCompany = () => {
  const { id } = useParams();
  const [organizer, setOrganizer] = useState(null);

  useEffect(() => {
    const fetchOrganizer = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/organizers/${id}`,
        );
        setOrganizer(res.data.data);
      } catch (err) {
        console.error("Error fetching organizers", err);
      }
    };
    fetchOrganizer();
  }, [id]);

  if (!organizer) return <div>Loading...</div>;

  return (
    <div className="">
      <div className="grid grid-cols-1 gap-4">
        {/* Company Details */}
        <div className="bg-(--bg-card) border border-(--border-color) rounded-xl p-5">
          <h3 className="text-lg font-bold mb-2 pb-2">Company Details</h3>
          <div className="grid grid-cols-2">
            {[
              ["Company Name", organizer.companyName],
              ["Company Email", organizer.companyEmail],
              [
                "Phone",
                `${organizer.companyMobileCountryCode || ""} ${organizer.companyMobile || ""}`,
              ],
              ["Website", organizer.companyWebsite],
              ["GST Number", organizer.companyGST],
              ["Zipcode", organizer.companyZipcode],
              ["Country", organizer.companyCountry],
              ["State", organizer.companyState],
              ["District", organizer.companyDistrict],
              ["Company Address", organizer.companyAddress],
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
            {organizer.companyLogo && (
              <div className="flex items-start gap-3 py-2.5 col-span-2">
                <div>
                  <p className="text-xs text-(--text-muted) mb-0.5">
                    Company Logo
                  </p>
                  <img
                    src={`http://localhost:3000${organizer.companyLogo}`}
                    alt="Company Logo"
                    className="h-10 object-contain border border-(--border-color) rounded p-1 mt-1"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Admin Details */}
        <div className="bg-(--bg-card) border border-(--border-color) rounded-xl p-5">
          <h3 className="text-lg font-bold mb-2 pb-2">Admin Details</h3>
          <div className="grid grid-cols-2">
            {[
              ["Admin Name", organizer.adminName],
              ["Admin Email", organizer.adminEmail],
              [
                "Admin Mobile",
                `${organizer.adminMobileCountryCode || ""} ${organizer.adminMobile || ""}`,
              ],
              ["Password", organizer.adminPassword ? "••••••••" : "—"],
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
          </div>
        </div>

        {/* Project Modules */}
        <div className="bg-(--bg-card) border border-(--border-color) rounded-xl p-5">
          <h3 className="text-lg font-bold mb-2 pb-2">Project Modules</h3>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {organizer.projectModules?.length > 0 ? (
              organizer.projectModules.map((module, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-sm font-medium border border-(--border-color) rounded-md"
                >
                  {module}
                </span>
              ))
            ) : (
              <span className="text-sm text-(--text-muted)">—</span>
            )}
          </div>
        </div>

        {/* Communication Emails */}
        <div className="bg-(--bg-card) border border-(--border-color) rounded-xl p-5">
          <h3 className="text-lg font-bold mb-2 pb-2">Communication Emails</h3>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {organizer.communicationEmails?.length > 0 ? (
              organizer.communicationEmails.map((email, index) => (
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

export default ViewCompany;
