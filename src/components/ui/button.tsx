import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        icon: "hover:scale-105 opacity-60 hover:opacity-100",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
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
  link?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      blacktxt,
      variant,
      size,
      asChild = false,
      link,
      loading,
      fullWidth,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Determine the component to render
    const Comp: React.ElementType = asChild ? Slot : "button";

    if (link) {
      return (
        <Link
          href={link}
          className={cn(
            buttonVariants({ variant, size }),
            fullWidth && "w-full",
            className,
            blacktxt && "text-foreground"
          )}
        >
          {children}
        </Link>
      );
    }

    // if no size and variant is icon, set size to icon
    if (!size && variant === "icon") size = "icon";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && "w-full",
          className,
          blacktxt && "text-foreground"
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
