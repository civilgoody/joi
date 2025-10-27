import { useFileUpload, UploadedFile } from "./use-file-upload";
import { FilePreview } from "./file-preview";
import { Accept } from "react-dropzone";
import { FaRegIdCard } from "react-icons/fa";

interface FileUploadProps {
  label: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  fileTypes?: FileType[];
  onChange?: (files: UploadedFile[]) => void;
}

export function FileUpload({
  label,
  maxFiles = 1,
  maxSize = 5, // Default to 5MB
  fileTypes = ["img", "pdf"],
  onChange,
}: FileUploadProps) {
  const acceptedTypesString = generateUploadDescription(fileTypes);

  const { files, getRootProps, getInputProps, isDragActive, removeFile } =
    useFileUpload({
      maxFiles,
      maxSize,
      fileTypes: generateAcceptObject(fileTypes),
      onChange,
    });

  return (
    <div
      {...getRootProps()}
      className={`border-img-dashed rounded-lg p-8 w-full text-center cursor-pointer transition-colors duration-200 ease-in-out bg-white
        ${isDragActive ? "drag-active" : ""}`}
    >
      <input {...getInputProps()} />

      {files.length > 0 ? (
        <div className="space-y-4">
          {files.map((file) => (
            <FilePreview key={file.id} file={file} onRemove={removeFile} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col font-mulish items-center justify-center gap-2 text-gray-500">
          <FaRegIdCard className="w-12 h-12 text-orange-400" />
          <p className="font-semibold text-primary font-cabin">{label}</p>
          <p className="text-sm font-light">
            {/* 👇 Use the new description string */}
            {acceptedTypesString} (Max {maxSize}MB)
          </p>
          <button
            type="button"
            className="mt-2 px-8 py-2 bg-[#FAFAFA] border border-gray-300 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-white hover:border-none"
          >
            Upload
          </button>
        </div>
      )}
    </div>
  );
}
export * from "./file-preview";
export * from "./use-file-upload";

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
