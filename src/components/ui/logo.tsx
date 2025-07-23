import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const logoSizes = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-20 h-20",
  xl: "w-24 h-24",
};

export function Logo({ size = "lg", className }: LogoProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Image
        src="https://framerusercontent.com/images/zlVHP5P0VRPQ2PgMh6MdbH1CKpk.png"
        alt="Joi"
        width={96}
        height={96}
        className={cn("object-contain", logoSizes[size])}
        priority
      />
    </div>
  );
}
