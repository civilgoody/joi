import { UploadedFile } from "./use-file-upload";
import { File as FileIcon, X } from "lucide-react";
import Link from "next/link";

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
          <span className="text-sm font-medium text-foreground/80 truncate max-w-[150px]">
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
      {/* {file.error && <p className="text-xs text-red-500 mt-1">{file.error}</p>} */}
    </div>
  );
}

interface ExistingFilePreviewProps {
  url: string;
  onRemove: (url: string) => void;
  name?: string;
}

export function ExistingFilePreview({
  url,
  onRemove,
  name,
}: ExistingFilePreviewProps) {
  const fileName = name || url.split("/").pop()?.split("?")[0] || "Document";
  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(url);
  return (
    <div
      className="relative flex items-center justify-between p-3 border rounded-md min-w-48 max-w-56 w-full bg-white"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-3">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={fileName}
            className="size-12 object-cover rounded-md"
          />
        ) : (
          <div className="size-12 flex items-center justify-center bg-gray-100 rounded-md">
            <FileIcon className="size-6 text-gray-500" />
          </div>
        )}
        <div className="flex flex-col truncate">
          <Link
            href={url}
            className="text-sm font-medium text-secondary hover:underline truncate max-w-[142px]"
            target="_blank"
          >
            {fileName}
          </Link>
          <span className="text-xs text-primary font-semibold uppercase">
            PREVIOUS UPLOAD
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(url);
        }}
        className="p-1 rounded-full hover:bg-gray-100"
        aria-label={`Remove ${fileName}`}
      >
        <X className="size-4 text-gray-600" />
      </button>

      {/* Verified indicator Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary rounded-b-md" />
    </div>
  );
}
