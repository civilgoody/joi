import {
  SelectContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import React from "react";

export interface Option {
  value: string;
  label: string;
}

export function SelectSuite({
  placeholder,
  options,
  value,
  onValueChange,
  className,
  variant = "default",
  ...props
}: {
  placeholder?: string;
  options: Option[] | string[];
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  variant?: "default";
} & React.ComponentProps<typeof Select>) {
  const normalizedOptions = React.useMemo(() => {
    if (options.length > 0 && typeof options[0] === "string") {
      return (options as string[]).map((str) => ({
        value: str,
        label: str,
      }));
    }
    return options as Option[];
  }, [options]);
  return (
    <Select value={value} onValueChange={onValueChange} {...props}>
      <SelectTrigger
        className={cn(
          "h-14",
          variant === "default" &&
            "border-ring ring-ring/50 ring-1 font-medium font-poppins border-none bg-white placeholder:text-muted-foreground text-xs md:text-xs rounded pl-6 data-[placeholder]:text-muted-foreground",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {normalizedOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
