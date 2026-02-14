import React, { useState } from "react";
import { Control, FieldValues, Path, useFormContext } from "react-hook-form";
import { ControllerRenderProps } from "react-hook-form";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { LuEye, LuEyeOff } from "react-icons/lu";
// import { DatePicker } from "../ui/date-picker";
// import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

export type FormInputType =
  | "text"
  | "date"
  | "time"
  | "textarea"
  | "number"
  | "password"
  | "otp"
  | "default";

type BaseInputProps = Omit<
  React.ComponentPropsWithoutRef<typeof Input> &
    React.ComponentPropsWithoutRef<typeof Textarea>,
  "name" | "defaultValue" | "value" | "onChange" | "onBlur" | "ref" | "type"
>;

interface FormInputProps<
  TFieldValues extends FieldValues,
> extends BaseInputProps {
  control?: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  type?: FormInputType;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "icon";
  span?: number;
}

/**
 * A reusable form input component integrating Shadcn UI FormField, Label, Control, Message,
 * and Input/Textarea with React Hook Form.
 *
 * Handles types: text, date, textarea, number, password. Defaults to text.
 * Does NOT handle select inputs.
 */
export function FormInput<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  variant = "default",
  placeholder,
  description,
  disabled,
  span,
  ...rest
}: FormInputProps<TFieldValues>) {
  const [hidePassword, setHidePassword] = useState(true);
  const form = useFormContext<TFieldValues>();

  return (
    <FormField
      control={control || form.control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const renderInput = (
          field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>,
        ) => {
          const isPasswordInput = name === "password" || type === "password";
          const inputType = isPasswordInput && hidePassword ? "password" : type;

          // if (inputType === "date") {
          //   return (
          //     <DatePicker
          //       name={name}
          //       placeholder={placeholder}
          //       value={field.value ? new Date(field.value) : undefined}
          //       onChange={(date) => field.onChange(date)}
          //       disabled={disabled}
          //       className={cn(
          //         {
          //           "!border-red-500 !focus:ring-red-500": !!error,
          //         },
          //         rest.className
          //       )}
          //     />
          //   );
          // }

          if (inputType === "textarea") {
            return (
              <Textarea
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                {...rest}
                value={field.value ?? ""}
                className={cn(
                  {
                    "!border-red-500 !focus:ring-red-500": !!error,
                  },
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-1 focus-visible:border-none",
                  rest.className,
                )}
              />
            );
          }

          // if ([inputType, name].includes("otp")) {
          //   return (
          //     <InputOTP
          //       {...field}
          //       maxLength={4}
          //       placeholder={placeholder}
          //       disabled={disabled}
          //       inputMode="numeric"
          //       pattern="[0-9]*"
          //       className={cn(
          //         {
          //           "!border-red-500 !focus:ring-red-500": !!error,
          //         },
          //         "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-1 focus-visible:border-none",
          //         rest.className
          //       )}
          //     >
          //       <InputOTPGroup className="flex gap-4">
          //         {Array.from({ length: 4 }, (_, index) => (
          //           <InputOTPSlot
          //             key={index}
          //             index={index}
          //             inputMode="numeric"
          //             className="size-20 rounded-lg shadow-none outline-none"
          //           />
          //         ))}
          //       </InputOTPGroup>
          //     </InputOTP>
          //   );
          // }

          return (
            <div className="relative">
              {" "}
              <Input
                type={inputType}
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                {...rest}
                onChange={(e) => {
                  field.onChange(handleInputChange(e, type));
                }}
                className={cn(
                  {
                    "!border-red-500 !focus:ring-red-500": !!error,
                  },
                  variant === "default" &&
                    "border-ring ring-ring/50 ring-1 border-none bg-white font-poppins font-medium placeholder:text-[#C1C1C1] text-xs md:text-xs rounded pl-6",
                  "h-12 block", // Added pr-10 for icon space
                  rest.className,
                )}
              />
              {isPasswordInput && (
                <button
                  type="button"
                  onClick={() => setHidePassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 cursor-pointer"
                >
                  {hidePassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
                </button>
              )}
            </div>
          );
        };

        return (
          <FormItem className={cn(span && `md:col-span-${span}`)}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>{renderInput(field)}</FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
export function handleInputChange(
  e: React.ChangeEvent<HTMLInputElement>,
  type: FormInputType,
) {
  const { value, valueAsNumber } = e.target;
  if (type === "number") {
    return isNaN(valueAsNumber) ? "" : valueAsNumber;
  }
  return value;
}
