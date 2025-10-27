// hooks/useFileUpload.ts
import { useState, useCallback, useEffect } from "react";
import { useDropzone, FileRejection, Accept } from "react-dropzone";
import { toast } from "sonner";

// Define the structure for a file being managed by the hook
export interface UploadedFile {
  id: string;
  file: File;
  previewUrl: string;
  progress: number; // 0-100
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
}

// Define the options for the hook
interface FileUploadOptions {
  maxFiles?: number;
  maxSize?: number; // Size in MB
  fileTypes?: Accept;
  onChange?: (files: UploadedFile[]) => void;
}

export function useFileUpload({
  maxFiles = 1,
  maxSize = 5, // Default max size is 5MB
  fileTypes = {
    "image/*": [".jpeg", ".jpg", ".png"],
    "application/pdf": [".pdf"],
  },
  onChange,
}: FileUploadOptions) {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  // Memoize the onChange callback to prevent unnecessary re-renders
  const onFilesChange = useCallback(
    (updatedFiles: UploadedFile[]) => {
      onChange?.(updatedFiles);
    },
    [onChange]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      // Handle accepted files
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        // random id
        id: Math.random().toString(36).substring(2, 15),
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
        status: "pending",
      }));

      // Handle rejected files
      const rejectedFiles: UploadedFile[] = fileRejections.map(
        ({ file, errors }) => ({
          id: Math.random().toString(36).substring(2, 15),
          file,
          previewUrl: URL.createObjectURL(file), // Still create a URL for previewing the rejected file
          progress: 0,
          status: "error",
          error: errors.map((e) => e.message).join(", "),
        })
      );

      setFiles((prevFiles) => {
        const combined = [...prevFiles, ...newFiles, ...rejectedFiles];
        // Enforce the maxFiles limit
        const finalFiles = combined.slice(0, maxFiles);
        onFilesChange(finalFiles);
        return finalFiles;
      });
    },
    [maxFiles, onFilesChange]
  );

  const removeFile = useCallback(
    (id: string) => {
      setFiles((prevFiles) => {
        const fileToRemove = prevFiles.find((file) => file.id === id);
        if (fileToRemove) {
          // Clean up the object URL to prevent memory leaks
          URL.revokeObjectURL(fileToRemove.previewUrl);
        }
        const updatedFiles = prevFiles.filter((file) => file.id !== id);
        onFilesChange(updatedFiles);
        return updatedFiles;
      });
    },
    [onFilesChange]
  );

  // This is where you'd handle the actual upload to a server/storage bucket.
  // This example function simulates an upload with progress updates.
  const uploadFile = useCallback(
    async (fileToUpload: UploadedFile) => {
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === fileToUpload.id
            ? { ...f, status: "uploading", progress: 0 }
            : f
        )
      );

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setFiles((prevFiles) =>
          prevFiles.map((f) => {
            if (f.id === fileToUpload.id) {
              const newProgress = Math.min(f.progress + 10, 100);
              if (newProgress === 100) {
                clearInterval(progressInterval);
                onFilesChange(
                  prevFiles.map((pf) =>
                    pf.id === f.id
                      ? { ...f, status: "completed", progress: 100 }
                      : pf
                  )
                );
                return { ...f, status: "completed", progress: 100 };
              }
              return { ...f, progress: newProgress };
            }
            return f;
          })
        );
      }, 200);

      // Replace this with your actual upload API call
      // For example: `await uploadToS3(fileToUpload.file)`
      // On success, update status to 'completed'. On failure, set status to 'error'.
    },
    [onFilesChange]
  );

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.previewUrl));
    };
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    accept: fileTypes,
    onError: (err) => toast.error(err.message),
  });

  return {
    files,
    getRootProps,
    getInputProps,
    isDragActive,
    removeFile,
    uploadFile,
  };
}
