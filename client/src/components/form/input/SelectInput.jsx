import React from "react";
import ReactSelect from "react-select";
import FormLabel from "../form-ui/FormLabel";

const SelectInput = ({
  id,
  options = [],
  value,
  onChange,
  placeholder,
  name,
  label,
  disabled,
  mandatory,
  error = "",
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <FormLabel title={label} mandatory={mandatory} />
      <ReactSelect
        key={JSON.stringify(value)}
        inputId={id}
        name={name}
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Search..."}
        isDisabled={disabled}
        isSearchable
        classNames={{
          menu: () => "!bg-(--bg-input)",
          control: ({ isFocused }) =>
            `border !rounded-md !shadow-none ${
              error
                ? "!border-red-500 "
                : isFocused
                  ? "!border-blue-500 ring-2 ring-blue-500"
                  : "!border-gray-300"
            } ${disabled ? "bg-gray-200" : "!bg-(--bg-input)"}`,
        }}
      />
      {error != "" && (
        <p className="text-red-500 text-xs font-medium mt-0.5 ml-1">{error}</p>
      )}
    </div>
  );
};

export default SelectInput;
