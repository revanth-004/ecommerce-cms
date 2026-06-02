import {
  InfoCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";

export const Toast = ({ title, message, type = "success", onClose }) => {
  const styles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-500/40",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      icon: <CheckCircleOutlined />,
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-500/40",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      icon: <CloseCircleOutlined />,
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-500/40",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      icon: <InfoCircleOutlined />,
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-500/40",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      icon: <WarningOutlined />,
    },
  };

  const style = styles[type];

  return (
    <div
      className={`flex ${style.bg} border-2 ${style.border} rounded-xl shadow-md overflow-hidden`}
    >
      <div className="flex items-start p-3 gap-3  w-full">
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-full ${style.iconBg}`}
        >
          <span className={`${style.iconColor} text-xl`}>{style.icon}</span>
        </div>
        <div className="flex-1 items-center">
          <p className="font-semibold text-gray-800">{title}</p>
          <p className="text-sm font-mono text-gray-600 ">{message}</p>
        </div>

        <button className="cursor-pointer" onClick={onClose}>
          <span className={`${style.iconColor} text-sm flex items-start`}>
            <CloseOutlined />
          </span>
        </button>
      </div>
    </div>
  );
};
