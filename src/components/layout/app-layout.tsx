"use client";

import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <main className="container min-h-screen flex flex-col mx-auto max-w-md px-6 py-8">
        {children}
      </main>
    </div>
  );
}
