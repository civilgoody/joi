import { useDropzone, FileRejection, Accept } from "react-dropzone";
import { toast } from "sonner";
import { req } from "../../lib/api";
import type { AxiosProgressEvent } from "axios";

const MODULE_NAME = "exportpadi_crop";
export type UploadedFile = {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
  uploadedUrl?: string;
};

interface FileUploadOptions {
  maxFiles?: number;
  maxSize?: number; // in mb
  fileTypes?: Accept;
  onFilesChange?: (
    files: UploadedFile[] | ((prev: UploadedFile[]) => UploadedFile[]),
  ) => void;
  files: UploadedFile[];
  onUpload: (
    file: File,
    onProgress: (progress: number) => void,
  ) => Promise<{ url: string }>;
}

export function useFileUpload({
  maxFiles = 1,
  maxSize = 5,
  fileTypes = {
    "image/*": [".jpeg", ".jpg", ".png"],
    "application/pdf": [".pdf"],
  },
  onFilesChange,
  files,
  onUpload,
}: FileUploadOptions) {
  const uploadFile = async (fileToUpload: UploadedFile) => {
    try {
      onFilesChange?.((prev) =>
        prev.map((f) =>
          f.id === fileToUpload.id
            ? { ...f, status: "uploading", progress: 3 }
            : f,
        ),
      );

      const formData = new FormData();
      const uploadUrl = "/files/upload";
      let response: { url: string };

      if (onUpload) {
        response = await onUpload(fileToUpload.file, (progress) => {
          onFilesChange?.((prev) =>
            prev.map((f) =>
              f.id === fileToUpload.id ? { ...f, progress } : f,
            ),
          );
        });
      } else {
        // Generic file upload (existing behavior)
        formData.append("file", fileToUpload.file);
        formData.append("module", MODULE_NAME);

        response = await req.upload<{ url: string }>(
          uploadUrl,
          formData,
          "",
          (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );

              onFilesChange?.((prev) =>
                prev.map((f) =>
                  f.id === fileToUpload.id
                    ? {
                        ...f,
                        progress: percentCompleted,
                      }
                    : f,
                ),
              );
            }
          },
        );
      }

      onFilesChange?.((prev) =>
        prev.map((f) =>
          f.id === fileToUpload.id
            ? {
                ...f,
                status: "completed",
                progress: 100,
                uploadedUrl: response.url,
              }
            : f,
        ),
      );

      toast.success(`Uploaded ${fileToUpload.file.name}`, {
        id: "upload-success",
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Upload failed";
      onFilesChange?.((prev) =>
        prev.map((f) =>
          f.id === fileToUpload.id ? { ...f, status: "error", error: msg } : f,
        ),
      );
    }
  };

  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    const totalNewFiles = acceptedFiles.length + fileRejections.length;
    const availableSlots = maxFiles - files.length;

    if (totalNewFiles > availableSlots && availableSlots > 0) {
      toast.error(
        `You can only upload ${availableSlots} more file${availableSlots === 1 ? "" : "s"}`,
      );
    } else if (availableSlots === 0) {
      toast.error(
        `Maximum ${maxFiles} file${maxFiles === 1 ? "" : "s"} allowed`,
      );
      return;
    }

    // Group rejections by error type
    if (fileRejections.length > 0) {
      const errorTypes = new Set<string>();

      fileRejections.forEach(({ errors }) => {
        errors.forEach((error) => {
          errorTypes.add(error.code);
        });
      });

      // Toast once per error type
      if (errorTypes.has("file-too-large")) {
        toast.error(`Some files are too large. Maximum size is ${maxSize}MB`);
      }
      if (errorTypes.has("file-invalid-type")) {
        toast.error("Some files have invalid type");
      }
    }

    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 15),
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: "pending",
    }));

    if (maxFiles === 1) {
      files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
      onFilesChange?.(newFiles.slice(0, 1));
      if (newFiles[0]) uploadFile(newFiles[0]);
    } else {
      const combined = [...files, ...newFiles];
      const validNewFiles = newFiles.slice(0, availableSlots);
      const finalFiles = combined.slice(0, maxFiles);

      const droppedFiles = combined.slice(maxFiles);
      droppedFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl));

      onFilesChange?.(finalFiles);
      validNewFiles.forEach((f) => uploadFile(f));
    }
  };

  const removeFile = (id: string, currentFiles: UploadedFile[]) => {
    const fileToRemove = currentFiles.find((f) => f.id === id);
    if (fileToRemove) URL.revokeObjectURL(fileToRemove.previewUrl);
    const updated = currentFiles.filter((f) => f.id !== id);
    onFilesChange?.(updated);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize: maxSize * 1024 * 1024,
    accept: fileTypes,
    disabled: files.some((f) => f.status === "uploading"),
  });

  return {
    files,
    getRootProps,
    getInputProps,
    isDragActive,
    removeFile,
  };
}
