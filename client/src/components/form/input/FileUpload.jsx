import React, { useState, useCallback, useRef } from "react";
import { Image } from "antd";
import FormLabel from "../form-ui/FormLabel";
import { EyeFilled, DeleteFilled } from "@ant-design/icons";

const FileUpload = ({
  label,
  name,
  imageHeight,
  imageWidth,
  onChange,
  mandatory,
  multiple = false,
  error,
  acceptVideo = false,
  value = [],
  description,
  defaultImage = 0,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const fileList = Array.isArray(value) ? value : value ? [value] : [];
  const accept = acceptVideo ? "image/*,video/*" : "image/*";

  const getUrl = (file) =>
    typeof file === "string"
      ? `http://localhost:3000${file}`
      : URL.createObjectURL(file);

  const isVideo = (file) => {
    const n = typeof file === "string" ? file : file.name;
    return /\.(mp4|webm|ogg|mov)$/i.test(n);
  };

  const emit = (list, def = defaultImage) =>
    onChange({ fileList: list, defaultImage: def });

  const addFiles = useCallback(
    (incoming) => {
      const arr = Array.from(incoming);
      if (!arr.length) return;
      const updated = multiple ? [...fileList, ...arr] : [arr[0]];
      const def = multiple ? defaultImage : 0;
      emit(updated, def);
    },
    [fileList, multiple, defaultImage],
  );

  const handleInputChange = (e) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const handleRemove = (index) => {
    const updated = fileList.filter((_, i) => i !== index);
    const def =
      defaultImage >= updated.length
        ? Math.max(0, updated.length - 1)
        : defaultImage;
    emit(updated, def);
  };

  const handleSetDefault = (index) => emit(fileList, index);

  const handlePreview = (file) => {
    setPreviewSrc(getUrl(file));
    setPreviewOpen(true);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <div className="flex flex-col gap-2">
      <FormLabel title={label} mandatory={mandatory} />

      {description && (
        <p className="text-xs text-(--text-secondary)">{description}</p>
      )}

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label}`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && inputRef.current?.click()
        }
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`
          flex w-fit cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed px-4 py-2 text-sm
          transition-colors select-none
           ${
             isDragging
               ? "border-gray-300 bg-(--bg-primary-light)"
               : "border-(--border-color) hover:bg-(--bg-hover)"
           }
        `}
      >
        <span className="text-(--text-secondary)">
          {isDragging ? "Drop here" : "Upload file"}
        </span>
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {/* Preview grid */}
      {fileList.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-3">
          {fileList.map((file, index) => (
            <div
              key={index}
              className={`
                group relative overflow-hidden rounded-lg border-2 transition
                ${imageWidth || "w-auto"} ${imageHeight || "h-36"} max-w-52
                ${index == defaultImage && multiple ? "border-blue-500" : "border-(--border-color)"}
              `}
            >
              {/* Media */}
              {isVideo(file) ? (
                <video
                  src={getUrl(file)}
                  className="h-full w-full object-cover"
                  muted
                />
              ) : (
                <img
                  src={getUrl(file)}
                  alt={`upload-${index}`}
                  className="h-full w-full object-cover"
                />
              )}

              {/* Default badge */}
              {index == defaultImage && multiple && (
                <span className="absolute left-1 top-1 rounded bg-blue-500 px-1 text-xs text-white">
                  Default
                </span>
              )}

              {/* Action overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                {!isVideo(file) && (
                  <button
                    type="button"
                    title="Preview"
                    onClick={() => handlePreview(file)}
                    className="text-lg text-white transition hover:text-blue-500"
                  >
                    <EyeFilled />
                  </button>
                )}
                <button
                  type="button"
                  title="Remove"
                  onClick={() => handleRemove(index)}
                  className="text-lg text-white transition hover:text-red-500"
                >
                  <DeleteFilled />
                </button>
              </div>

              {/* Set default bar */}
              {index !== defaultImage && multiple && (
                <div className="absolute bottom-0 left-0 right-0 flex justify-center bg-black/40 px-1 py-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => handleSetDefault(index)}
                    className="text-sm font-semibold text-white hover:text-blue-300"
                  >
                    Set default
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Ant Design hidden preview trigger */}
      {previewSrc && (
        <Image
          styles={{ root: { display: "none" } }}
          src={previewSrc}
          preview={{
            open: previewOpen,
            onOpenChange: (v) => setPreviewOpen(v),
            afterOpenChange: (v) => !v && setPreviewSrc(""),
          }}
        />
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FileUpload;
