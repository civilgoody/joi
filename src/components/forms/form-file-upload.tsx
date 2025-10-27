import React from "react";
import { Control, FieldValues, Path, useFormContext } from "react-hook-form";
import { FormField, FormItem } from "@/components/ui/form";
import { FormControl, FormMessage } from "@/components/ui/form";
import { FormDescription } from "@/components/ui/form";
import { FileUpload } from "@/lib/file-upload";

type FileUploadProps = React.ComponentProps<typeof FileUpload>;

interface FormFileUploadProps<TFieldValues extends FieldValues>
  extends Omit<FileUploadProps, "onChange" | "label"> {
  control?: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  description?: string;
}

export function FormFileUpload<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  ...rest
}: FormFileUploadProps<TFieldValues>) {
  const form = useFormContext<TFieldValues>();
  return (
    <FormField
      control={control || form.control}
      name={name}
      render={(
        {
          // field, fieldState: { error }
        }
      ) => (
        <FormItem>
          {/* <FormLabel className={error ? "text-red-500" : ""}>{label}</FormLabel> */}
          <FormControl>
            <FileUpload
              label={label}
              {...rest} // onChange={field.onChange}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
