"use client";

import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import { useId, useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

type PasswordInputProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  hideReqs?: boolean;
  className?: string;
};

const requirements = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[0-9]/, text: "At least 1 number" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
];

const strengthColors = {
  0: "bg-border",
  1: "bg-red-500",
  2: "bg-orange-500",
  3: "bg-amber-500",
  4: "bg-emerald-500",
};

const strengthTexts = {
  0: "Enter a password",
  1: "Weak password",
  2: "Weak password",
  3: "Medium password",
  4: "Strong password",
};

export function FormPassword<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Password",
  hideReqs = false,
  className,
}: PasswordInputProps<TFieldValues>) {
  const id = useId();
  const [isVisible, setIsVisible] = useState(false);

  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  const strength = requirements.map((req) => ({
    met: req.regex.test(field.value || ""),
    text: req.text,
  }));

  const score = strength.filter((req) => req.met).length;
  const color = strengthColors[score as keyof typeof strengthColors];
  const text = strengthTexts[score as keyof typeof strengthTexts];

  return (
    <div className={className}>
      <div className="space-y-2">
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="relative">
          <Input
            {...field}
            aria-describedby={`${id}-description`}
            className={cn(
              "pe-9 h-12 block",
              error && "border-red-500",
              // "border-ring ring-ring/50 ring-1 border-none bg-white font-poppins font-medium placeholder:text-[#C1C1C1] text-xs md:text-xs rounded pl-6",
            )}
            id={id}
            placeholder={placeholder}
            type={isVisible ? "text" : "password"}
          />
          <button
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            onClick={() => setIsVisible((prev) => !prev)}
            type="button"
          >
            {isVisible ? (
              <EyeOffIcon aria-hidden="true" size={16} />
            ) : (
              <EyeIcon aria-hidden="true" size={16} />
            )}
          </button>
        </div>
      </div>

      {!hideReqs && (
        <>
          <div
            aria-label="Password strength"
            aria-valuemax={4}
            aria-valuemin={0}
            aria-valuenow={score}
            className="mt-3 mb-4 h-1 w-full overflow-hidden rounded-full bg-border"
            role="progressbar"
            tabIndex={-1}
          >
            <div
              className={`h-full ${color} transition-all duration-500 ease-out`}
              style={{ width: `${(score / 4) * 100}%` }}
            />
          </div>

          <p
            className="mb-2 font-medium text-foreground text-sm"
            id={`${id}-description`}
          >
            {text}. Must contain:
          </p>

          <ul aria-label="Password requirements" className="space-y-1.5">
            {strength.map((req) => (
              <li className="flex items-center gap-2" key={req.text}>
                {req.met ? (
                  <CheckIcon
                    aria-hidden="true"
                    className="text-emerald-500"
                    size={16}
                  />
                ) : (
                  <XIcon
                    aria-hidden="true"
                    className="text-muted-foreground/80"
                    size={16}
                  />
                )}
                <span
                  className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}
                >
                  {req.text}
                  <span className="sr-only">
                    {req.met ? " - Requirement met" : " - Requirement not met"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error.message}</p>}
    </div>
  );
}
