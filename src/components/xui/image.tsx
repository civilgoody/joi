// icon image component
import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";

export const IconImage = ({
  src,
  alt,
  size = "md",
  className,
}: {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) => {
  const wh = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 40,
  };
  return (
    <Image
      src={src}
      alt={alt}
      width={wh[size]}
      height={wh[size]}
      className={cn(`size-${wh[size] / 4}`, className)}
    />
  );
};

// import React, { useState } from "react";

// const ERROR_IMG_SRC =
//   "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

export function ImageWithFallback(props: ImageProps) {
  // const [didError, setDidError] = useState(false);

  // const handleError = () => {
  //   setDidError(true);
  // };

  const { src, alt, style, className, ...rest } = props;

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      // onError={handleError}
    />
  );
  // didError ?
  //   (
  //   <div
  //     className={`inline-block bg-gray-100 text-center align-middle ${className ?? ""}`}
  //     style={style}
  //   >
  //     <div className="flex items-center justify-center w-full h-full">
  //       <Image
  //         src={ERROR_IMG_SRC}
  //         alt="Error loading image"
  //         {...rest}
  //         data-original-url={src}
  //       />
  //     </div>
  //   </div>
  // ) :
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export function Img({ width, height, alt, ...rest }: ImageProps) {
  const sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";
  const placeholder =
    Number(height) > 40
      ? `data:image/svg+xml;base64,${toBase64(shimmer(width as number, height as number))}`
      : undefined;
  return (
    <div>
      <Image
        alt={alt}
        width={width}
        height={height}
        sizes={rest.fill ? sizes : undefined}
        className={cn({ "object-cover": rest.fill }, rest.className)}
        placeholder={placeholder as "blur" | undefined}
        {...rest}
      />
    </div>
  );
}
