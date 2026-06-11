import React from "react";
import { DeleteOutlined } from "@ant-design/icons";

const Card = (props) => {
  const {
    index,
    title,
    titleStyle,
    cardStyle,
    className,
    children,
    onDelete,
    hasDelete = false,
  } = props;

  return (
    <div
      className={`${cardStyle} px-6 py-4 bg-(--bg-card) rounded-xl border border-(--border-color)`}
    >
      {title && (
        <div className="flex items-center justify-between">
          <h1 className={`${titleStyle ?? ""}`}>{title}</h1>
          {hasDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="px-2 py-1 text-white  bg-red-500 border-2 rounded-lg border-red-400 active:scale-95 hover:scale-105 transition"
            >
              <span className="text-sm">Delete </span>
              <DeleteOutlined />
            </button>
          )}
        </div>
      )}
      <div className={`${className ?? " "}`}>{children}</div>
    </div>
  );
};

export default Card;
