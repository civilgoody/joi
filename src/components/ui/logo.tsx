import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: "sm" | "md" | "lg" | "xl";
  retina?: boolean;
  variant?: "default" | "white" | "dark";
}

const sizeClasses = {
  sm: "h-8 w-auto",
  md: "h-9 w-auto",
  lg: "h-12 w-auto",
  xl: "h-16 w-auto",
};

export const Logo = React.forwardRef<HTMLImageElement, LogoProps>(
  (
    {
      size = "md",
      retina = true,
      variant = "default",
      className,
      alt = "Logo",
      ...props
    },
    ref
  ) => {
    const logoSrc = retina ? "/images/logo@2x.png" : "/images/logo.jpeg";

    return (
      <Link href="/">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={ref}
          src={logoSrc}
          alt={alt}
          className={cn(
            sizeClasses[size],
            variant === "white" && "brightness-0 invert",
            variant === "dark" && "brightness-0",
            className
          )}
          {...props}
        />
      </Link>
    );
  }
);

Logo.displayName = "Logo";
