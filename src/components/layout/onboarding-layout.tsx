"use client";

import { FaChevronCircleLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  showBack?: boolean;
  showSkip?: boolean;
  onBack?: () => void;
  onSkip?: () => void;
  className?: string;
}

export function OnboardingLayout({
  children,
  showBack = false,
  showSkip = false,
  onBack,
  onSkip,
  className,
}: OnboardingLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-background flex flex-col max-w-sm mx-auto",
        className
      )}
    >
      {/* Header with navigation */}
      <header className="flex items-center justify-between pt-6">
        {showBack && (
          <Button
            variant="ghost"
            // size="icon"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground text-lg font-bold px-4"
          >
            <FaChevronCircleLeft size={20} className="min-w-4 h-4" />
            <span className="ml-2">Back</span>
          </Button>
        )}

        {showSkip && (
          <Button
            variant="ghost"
            onClick={onSkip}
            className="text-muted-foreground hover:text-foreground text-lg font-bold px-4 ml-auto"
          >
            Skip
          </Button>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col px-6 pb-8">{children}</main>
    </div>
  );
}
