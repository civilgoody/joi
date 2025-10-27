"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";

type DialogSuiteProps = {
  /** The element that opens the dialog */
  trigger: React.ReactNode;
  /** The dialog body content */
  children: React.ReactNode;
  /** Optional title & description */
  title?: string;
  description?: string;
  /** Optional footer (e.g. buttons) */
  footer?: React.ReactNode;
  /** Optional className override for content */
  contentClassName?: string;
  /** Controlled open state */
  open?: boolean;
  /** Callback for open state change */
  onOpenChange?: (open: boolean) => void;
};

export function DialogSuite({
  trigger,
  children,
  title,
  description,
  footer,
  contentClassName,
  open,
  onOpenChange,
}: DialogSuiteProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={cn("sm:max-w-md", contentClassName)}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        {/* Main dialog content */}
        <div className="py-2">{children}</div>

        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

export { DialogClose };
