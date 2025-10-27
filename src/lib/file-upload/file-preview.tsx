// components/FilePreview.tsx
import { UploadedFile } from "./use-file-upload";
import { File as FileIcon, X } from "lucide-react";

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

interface FilePreviewProps {
  file: UploadedFile;
  onRemove: (id: string) => void;
}

export function FilePreview({ file, onRemove }: FilePreviewProps) {
  const isImage = file.file.type.startsWith("image/");

  return (
    <div className="relative flex items-center justify-between p-3 border rounded-md">
      <div className="flex items-center gap-3">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={file.previewUrl}
            alt={file.file.name}
            className="h-12 w-12 object-cover rounded-md"
            onLoad={() => URL.revokeObjectURL(file.previewUrl)} // Revoke on load to free memory
          />
        ) : (
          <div className="h-12 w-12 flex items-center justify-center bg-gray-100 rounded-md">
            <FileIcon className="h-6 w-6 text-gray-500" />
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800 truncate max-w-[150px]">
            {file.file.name}
          </span>
          <span className="text-xs text-gray-500">
            {formatBytes(file.file.size)}
          </span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the dropzone click
          onRemove(file.id);
        }}
        className="p-1 rounded-full hover:bg-gray-100"
        aria-label={`Remove ${file.file.name}`}
      >
        <X className="h-4 w-4 text-gray-600" />
      </button>

      {/* Progress Bar & Status */}
      <div className="absolute bottom-0 left-0 right-0 h-1">
        <div
          className={`h-full rounded-b-md transition-all duration-300 ${
            file.status === "completed"
              ? "bg-green-500"
              : file.status === "error"
                ? "bg-red-500"
                : "bg-orange-500"
          }`}
          style={{ width: `${file.status === "error" ? 100 : file.progress}%` }}
        />
      </div>
      {file.error && <p className="text-xs text-red-500 mt-1">{file.error}</p>}
    </div>
  );
}
