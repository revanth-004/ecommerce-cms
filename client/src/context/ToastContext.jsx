import { createContext, useContext, useState } from "react";
import { Toast } from "../components/ui/Toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const id = Date.now();

  // Show toasts
  const showToast = (message, type = "success") => {
    const titles = {
      success: "Success",
      error: "Error",
      info: "Info",
      warning: "Warning",
    };

    setToasts((prev) => [...prev, { id, title: titles[type], message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  //   Remove Toast
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed top-5 right-5 flex flex-col gap-4 z-50">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
