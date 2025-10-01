import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-5",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-light",
        peach:
          "bg-accent-peach text-foreground hover:bg-primary-light hover:text-primary-foreground",
        black:
          "bg-foreground text-white hover:bg-primary-light hover:text-primary-foreground",
        // blg: "bg-primary-light text-foreground border border-primary-dark hover:bg-transparent hover:text-foreground",
        accent:
          "bg-accent text-accent-foreground border hover:border-primary hover:bg-transparent hover:text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-secondary text-muted-light bg-background hover:bg-accent hover:text-accent-foreground hover:text-white hover:bg-secondary hover:border-secondary [&_svg]:hover:fill-white [&_svg]:fill-secondary [&_svg]:sm:size-8 px-4 font-bold [&_span]:w-3/5 [&_span]:text-center",
        secondary:
          "bg-secondary text-secondary-foreground border border-secondary hover:bg-transparent hover:text-foreground [&_svg]:hover:fill-secondary [&_svg]:sm:size-8 px-4 font-bold [&_span]:w-3/5 [&_span]:text-center",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        icon: "hover:scale-105 opacity-60 hover:opacity-100",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 sm:h-12 rounded-md px-4 min-w-48",
        xl: "h-10 sm:h-14 min-w-48 font-bold text-base",
        icon: "h-4 w-4 p-0 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: LucideIcon;
  loading?: boolean;
  fullWidth?: boolean;
  blacktxt?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      blacktxt,
      variant,
      size,
      asChild = false,
      icon,
      loading,
      fullWidth,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // if no size and variant is icon, set size to icon
    if (!size && variant === "icon") size = "icon";

    // Smart defaults
    const IconComponent = loading ? Loader2 : icon;
    const hasIcon = icon || loading;
    const isIconOnly = hasIcon && !children;
    const shouldAlignLeft = hasIcon && children && !isIconOnly;

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && "w-full",
          shouldAlignLeft && "justify-start",
          className,
          blacktxt && "text-foreground"
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {hasIcon && IconComponent && (
          <IconComponent className={cn(loading && "animate-spin")} />
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
