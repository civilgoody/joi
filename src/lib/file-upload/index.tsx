"use client";
import { useFileUpload, UploadedFile } from "./use-file-upload";
import { FilePreview, ExistingFilePreview } from "./file-preview";
import { Accept } from "react-dropzone";
import { useEffect, useState } from "react";
import { FaCloudArrowUp } from "react-icons/fa6";

interface FileUploadProps {
  maxFiles?: number;
  maxSize?: number; // in MB
  fileTypes?: FileType[];
  onChange?: (files: string[] | string) => void;
  onUpload: (
    file: File,
    onProgress: (progress: number) => void,
  ) => Promise<{ url: string }>;
  existingFiles?: string | string[];
}

export function FileUpload({
  maxFiles = 1,
  maxSize = 5, // Default to 5MB
  fileTypes = ["img", "pdf"],
  onChange,
  onUpload,
  existingFiles: existingFilesProp,
}: FileUploadProps) {
  const acceptedTypesString = generateUploadDescription(fileTypes);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dismissedUrls, setDismissedUrls] = useState<string[]>([]);

  const existingFiles = (
    Array.isArray(existingFilesProp)
      ? existingFilesProp
      : existingFilesProp
        ? [existingFilesProp]
        : []
  ).filter(
    (url) =>
      !files.some((f) => f.uploadedUrl === url) && !dismissedUrls.includes(url),
  );

  // If maxFiles is 1, we only want to show existing files if no new files are uploaded
  const displayedExistingFiles =
    maxFiles === 1 && files.length > 0 ? [] : existingFiles;

  const handleChange = (
    newFiles: UploadedFile[] | ((prev: UploadedFile[]) => UploadedFile[]),
  ) => {
    setFiles((prev) => {
      const next = typeof newFiles === "function" ? newFiles(prev) : newFiles;
      return next;
    });
  };

  useEffect(() => {
    const uploadedUrls = files
      .map((f) => f.uploadedUrl)
      .filter((url): url is string => !!url);

    // Only notify if we have successes or if the list was cleared
    if (uploadedUrls.length > 0 || files.length === 0) {
      onChange?.(maxFiles > 1 ? uploadedUrls : uploadedUrls[0] || "");
    }
  }, [files, maxFiles, onChange]);

  const { getRootProps, getInputProps, isDragActive, removeFile } =
    useFileUpload({
      maxFiles,
      maxSize,
      fileTypes: generateAcceptObject(fileTypes),
      onFilesChange: handleChange,
      files,
      onUpload,
    });

  const isUploading = files.some((f) => f.status === "uploading");

  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    };
  }, [files]);

  return (
    <div
      {...getRootProps()}
      className={`border-img-dashed flex flex-col justify-center gap-2 rounded-lg overflow-auto p-8 w-full text-center transition-colors duration-200 ease-in-out bg-[#0F11154D]/30
        ${isDragActive ? "drag-active" : ""}
        ${isUploading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <input {...getInputProps()} />

      {files.length > 0 || displayedExistingFiles.length > 0 ? (
        <div className="flex gap-2 justify-center overflow-x-auto">
          {displayedExistingFiles.map((url) => (
            <ExistingFilePreview
              key={url}
              url={url}
              onRemove={(removedUrl) => {
                setDismissedUrls((prev) => [...prev, removedUrl]);
                if (maxFiles > 1) {
                  const updated = existingFiles.filter((u) => u !== removedUrl);
                  onChange?.(updated);
                } else {
                  onChange?.("");
                }
              }}
            />
          ))}
          {files.map((file) => (
            <FilePreview
              key={file.id}
              file={file}
              onRemove={(id) => removeFile(id, files)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col font-mulish items-center justify-center gap-2 text-gray-500">
          <FaCloudArrowUp className="w-12 h-12 text-gray-500" />
          <p className="text-foreground/80 text-sm">
            Drag and Drop your files here
          </p>
        </div>
      )}
      <p className="text-xs text-muted-foreground/80 tracking-tighter uppercase">
        {/* 👇 Use the new description string */}
        {acceptedTypesString} only (Max {maxSize}MB){", "}
        {maxFiles > 1 ? `Max ${maxFiles} files` : ""}
      </p>
      <button
        type="button"
        className="mt-2 max-w-full text-center mx-auto px-4 py-2 bg-[#2A2E38] rounded-lg text-sm text-foreground/80 hover:bg-primary hover:text-white hover:border-none disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={
          isUploading ||
          (maxFiles > 1 &&
            files.length + displayedExistingFiles.length >= maxFiles)
        }
      >
        {isUploading ? "Uploading..." : "Browse Files"}
      </button>
    </div>
  );
}

/**
 * Supported file types for file uploads
 * @example
 * const fileTypes: FileType[] = ['pdf', 'doc']
 */
export type FileType = "pdf" | "doc" | "img" | "audio";

/**
 * Maps file types to their MIME types and extensions
 */
export const FILE_TYPE_MAPPINGS = {
  pdf: {
    accept: "application/pdf",
    extensions: ["PDF"],
    simpleName: "PDF",
  },
  doc: {
    accept:
      "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    extensions: ["DOC", "DOCX"],
    simpleName: "Document",
  },
  img: {
    accept: "image/jpeg,image/png,image/webp",
    extensions: ["JPG", "PNG", "WEBP"],
    simpleName: "Image",
  },
  audio: {
    accept: "audio/mpeg,audio/mp3,audio/wav,audio/ogg",
    extensions: ["MP3", "WAV", "OGG"],
    simpleName: "Audio",
  },
} as const;

/**
 * ✨ NEW ✨
 * Generates the `Accept` object required by react-dropzone.
 * @param fileTypes - Array of supported file types
 * @returns An object compatible with react-dropzone's `accept` prop.
 */
export const generateAcceptObject = (fileTypes: FileType[]): Accept => {
  const acceptObject: Accept = {};
  fileTypes.forEach((type) => {
    const mapping = FILE_TYPE_MAPPINGS[type];
    const mimeTypes = mapping.accept.split(",").map((m) => m.trim());
    const extensions = mapping.extensions.map((ext) => `.${ext.toLowerCase()}`);

    mimeTypes.forEach((mime) => {
      acceptObject[mime] = extensions;
    });
  });
  return acceptObject;
};

/**
 * Generates a human-readable description of accepted file types.
 * @param fileTypes - Array of supported file types
 * @returns Formatted string of accepted types.
 */
export const generateUploadDescription = (fileTypes: FileType[]): string =>
  `${fileTypes.map((type) => FILE_TYPE_MAPPINGS[type].simpleName).join(", ")}`;
