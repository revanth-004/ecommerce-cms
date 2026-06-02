import React from "react";

const Checkbox = (props) => {
  const { id, label, checked, onChange, value, className = "" } = props;
  return <div className={`flex gap-4 items-center ${className}`}></div>;
};

export default Checkbox;
