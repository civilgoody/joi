"use client";

import * as React from "react";
import { FieldValues, Path, Control, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export interface Option {
  value: string;
  label: string;
}

interface FormSelectProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  label?: string;
  options: readonly Option[] | readonly string[];
  variant?: "default" | "icon";
  placeholder?: string;
  control?: Control<TFieldValues>;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
  labelElement?: React.ReactNode;
  itemClassName?: string;
}

export function FormSelect<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  options,
  variant = "default",
  placeholder = "Select",
  control,
  className,
  triggerClassName,
  contentClassName,
  disabled,
  labelElement,
  itemClassName = "",
}: FormSelectProps<TFieldValues>) {
  const form = useFormContext<TFieldValues>();
  const normalizedOptions = React.useMemo(() => {
    if (options.length > 0 && typeof options[0] === "string") {
      return (options as readonly string[]).map((str) => ({
        value: str,
        label: str,
      }));
    }
    return options as readonly Option[];
  }, [options]);

  return (
    <FormField
      control={control || form.control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={cn("w-full", className)}>
          {labelElement
            ? labelElement
            : label && <FormLabel htmlFor={name}>{label}</FormLabel>}
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger
                id={name}
                className={cn(
                  {
                    "border-red-500 focus:ring-red-500": !!error,
                  },
                  variant === "default" &&
                    "border-ring ring-ring/50 ring-1 border-none bg-white font-poppins placeholder:text-[#C1C1C1] text-xs md:text-xs rounded pl-6 data-[placeholder]:text-[#C1C1C1]",
                  triggerClassName
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={contentClassName}>
              {/* Uses normalizedOptions to render SelectItem components */}
              {normalizedOptions.map((option) => (
                <SelectItem
                  className={itemClassName}
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
