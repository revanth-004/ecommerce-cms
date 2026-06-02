import React from "react";
import FormLabel from "../form-ui/FormLabel";
const FileInput = (props) => {
  const {
    id,
    type,
    name,
    desc,
    placeholder,
    value,
    label,
    onChange,
    className,
    disabled,
    mandatory,
    multiple = false,
    acceptVideo = false,
    error = "",
  } = props;
  return (
    <div className="flex flex-col gap-1.5">
      <FormLabel title={label} className="" mandatory={mandatory} />
      <p className="text-xs text-(--text-secondary)">{desc}</p>

      <input
        type="file"
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        multiple={multiple}
        accept={`.jpg, .jpeg, .png, ${acceptVideo ? ".mp4, .mov," : ""}`}
        disabled={disabled}
        style={{ width: "auto", display: "inline-block" }}
        className={`text-sm text-gray-500 cursor-pointer max-w-md
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border
          file:text-sm file:font-medium
          file:transition-all
          ${
            disabled
              ? "file:bg-gray-100 file:text-gray-400 file:border-gray-200 file:cursor-not-allowed"
              : error
                ? "file:bg-red-50 file:text-red-700 file:border-red-500 hover:file:bg-red-100"
                : "file:bg-white file:text-gray-700 file:border-gray-300 hover:file:bg-gray-50"
          } ${className}`}
      />
      {error != "" && (
        <p className="text-red-500 text-xs font-medium mt-0.5 ml-1">{error}</p>
      )}
    </div>
  );
};

export default FileInput;
