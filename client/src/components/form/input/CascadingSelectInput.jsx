import React from "react";
import ReactSelect from "react-select";
import { DeleteOutlined } from "@ant-design/icons";

const CascadingSelectInput = ({
  label,
  mandatory,
  error = "",
  showDelete,
  onDelete,
  firstPlaceholder = "Select...",
  firstOptions = [],
  firstValue,
  onFirstChange,
  firstDisabled = false,
  secondPlaceholder = "Select...",
  secondOptions = [],
  secondValue,
  onSecondChange,
  secondDisabled = false,
}) => {

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <ReactSelect
          // key={JSON.stringify(firstValue)}
          options={firstOptions}
          value={firstValue}
          onChange={onFirstChange}
          placeholder={firstPlaceholder}
          isDisabled={false}
          isSearchable
          classNames={{
            menu: () => "!bg-(--bg-input)",
            control: ({ isFocused }) =>
              `border !rounded-md !shadow-none ${
                error
                  ? "!border-red-500"
                  : isFocused
                    ? "!border-blue-500 ring-2 ring-blue-500"
                    : "!border-gray-300"
              } ${firstDisabled ? "bg-gray-200" : "!bg-(--bg-input)"}`,
          }}
        />
        <p className="font-bold text-gray-400">:</p>
        <ReactSelect
          // key={JSON.stringify(secondValue)}
          options={secondOptions}
          value={secondValue}
          onChange={onSecondChange}
          placeholder={secondPlaceholder}
          isDisabled={secondDisabled }
          isSearchable
          classNames={{
            menu: () => "!bg-(--bg-input)",
            control: ({ isFocused }) =>
              `border !rounded-md !shadow-none ${
                error
                  ? "!border-red-500"
                  : isFocused
                    ? "!border-blue-500 ring-2 ring-blue-500"
                    : "!border-gray-300"
              } ${secondDisabled ? "bg-gray-200" : "!bg-(--bg-input)"}`,
          }}
        />
        {showDelete && (
          <button type="button" onClick={onDelete} className="">
            <DeleteOutlined
              style={{ fontSize: "20px", color: "red" }}
              className="opacity-40 cursor-pointer hover:opacity-80"
            />
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs font-medium mt-0.5 ml-1">{error}</p>
      )}
    </div>
  );
};

export default CascadingSelectInput;
