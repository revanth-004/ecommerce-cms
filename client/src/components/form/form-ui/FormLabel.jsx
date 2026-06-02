import React from "react";

const FormLabel = ({ title, className = "", mandatory }) => {
  return (
    <label
      htmlFor=""
      className={`text-sm font-semibold text-(--text-secondary) ${className}`}
    >
      {`${title} `}
      {mandatory && <span className=" text-red-500 ">*</span>}
    </label>
  );
};

export default FormLabel;
