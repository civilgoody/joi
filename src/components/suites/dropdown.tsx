import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
export function DropdownMenuSuite({
  children,
  trigger,
  contentClassName,
  align = "start",
  sideOffset = 4,
}: {
  children: React.ReactNode;
  trigger: React.ReactNode;
  contentClassName?: string;
  align?: "start" | "center" | "end";
  sideOffset?: number;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn("w-56", contentClassName)}
        align={align}
        sideOffset={sideOffset}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
