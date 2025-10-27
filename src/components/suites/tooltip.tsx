import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipArrow,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ReactNode, ComponentPropsWithoutRef } from "react";

interface TooltipSuiteProps {
  trigger?: ReactNode;
  children: ReactNode;
  showArrow?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
}

interface TooltipTriggerWrapperProps
  extends ComponentPropsWithoutRef<typeof Button> {
  children?: ReactNode;
  asChild?: boolean;
}

// Compound component for trigger - renders Button by default
function TooltipSuiteTrigger({
  children,
  asChild,
  ...buttonProps
}: TooltipTriggerWrapperProps) {
  if (asChild) {
    return <TooltipTrigger asChild>{children}</TooltipTrigger>;
  }

  return (
    <TooltipTrigger asChild>
      <Button {...buttonProps}>{children}</Button>
    </TooltipTrigger>
  );
}

// Export Trigger as a named export
export { TooltipSuiteTrigger as Trigger };

// Main component
export function TooltipSuite({
  trigger,
  children,
  showArrow = true,
  side = "top",
  align = "center",
  className = "",
}: TooltipSuiteProps) {
  const hasCompoundTrigger = Array.isArray(children)
    ? children.some((child: any) => child?.type === TooltipSuiteTrigger)
    : (children as any)?.type === TooltipSuiteTrigger;

  if (hasCompoundTrigger) {
    const childArray = Array.isArray(children) ? children : [children];
    const triggerChild = childArray.find(
      (child: any) => child?.type === TooltipSuiteTrigger
    );
    const contentChildren = childArray.filter(
      (child: any) => child?.type !== TooltipSuiteTrigger
    );

    return (
      <Tooltip>
        {triggerChild}
        <TooltipContent side={side} align={align} className={className}>
          {showArrow && <TooltipArrow />}
          {contentChildren}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent side={side} align={align} className={className}>
        {showArrow && <TooltipArrow />}
        {children}
      </TooltipContent>
    </Tooltip>
  );
}

TooltipSuite.Trigger = TooltipSuiteTrigger;
