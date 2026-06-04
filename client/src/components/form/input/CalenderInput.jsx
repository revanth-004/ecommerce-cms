import React from "react";
import FormLabel from "../form-ui/FormLabel";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const CalenderInput = (props) => {
  const {
    value,
    label,
    placeholder,
    onChange,
    className,

    mandatory,
    format,
    error = "",
  } = props;
  return (
    <div className="flex flex-col gap-1.5">
      {label && <FormLabel title={label} className="" mandatory={mandatory} />}
      <DatePicker
        value={value}
        onChange={onChange}
        format={format}
        className={`w-full px-3 py-2 border border-(--border-color) rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${className} ${
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-(--border-color) focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        }`}
        placeholder={placeholder}
      />
      {error !== "" && (
        <p className="text-red-500 text-xs font-medium mt-0.5 ml-1">{error}</p>
      )}
    </div>
  );
};

export default CalenderInput;
