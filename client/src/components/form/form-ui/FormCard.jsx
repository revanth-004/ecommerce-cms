import React from "react";

const FormCard = ({ children, title, className = "", titleStyle = "h3" }) => {
  return (
    <div
      className={`px-6 py-4 bg-(--bg-card) rounded-xl border border-(--border-color) ${className}`}
    >
      {titleStyle === "h3" && (
        <h3 className="text-lg font-bold mb-2 pb-2">{title}</h3>
      )}
      {titleStyle === "h4" && (
        <h4 className="text-md font-semibold mb-2 pb-2">{title}</h4>
      )}
      {children}
    </div>
  );
};

export default FormCard;
