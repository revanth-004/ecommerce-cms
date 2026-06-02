import React from "react";
import FormLabel from "../form-ui/FormLabel";

const TextArea = (props) => {
  const {
    placeholder,
    name,
    rows,
    value,
    onChange,
    label,
    className,
    disabled,
    error,
    mandatory,
  } = props;

  return (
    <div className="flex flex-col gap-1.5">
      <FormLabel title={label} className="" mandatory={mandatory} />
      <textarea
        name={name}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-3 py-2 border border-(--border-color) rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${className} ${
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-(--border-color) focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        } 
          ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-(--bg-input)"}`}
      />
      {error != "" && (
        <p className="text-red-500 text-xs font-medium mt-0.5 ml-1">{error}</p>
      )}
    </div>
  );
};

export default TextArea;
