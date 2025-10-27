// import { ThemeProvider } from "../theme/theme-provider";
import { QueryProvider } from "./query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <TooltipProvider>
        {/* <ThemeProvider> */}
        {children}
        {/* </ThemeProvider> */}
      </TooltipProvider>
    </QueryProvider>
  );
}
