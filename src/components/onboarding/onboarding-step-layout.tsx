"use client";

import { Button } from "@/components/ui/button";

interface OnboardingStepLayoutProps {
  titleComponent: React.ReactNode;
  stepNumber: string;
  buttonText: string;
  onButtonClick: () => void;
  children?: React.ReactNode;
}

export function OnboardingStepLayout({
  titleComponent,
  stepNumber,
  buttonText,
  onButtonClick,
  children,
}: OnboardingStepLayoutProps) {
  return (
    <div className="flex-1 flex flex-col justify-end gap-2">
      {/* Step indicator */}
      <div className="text-lg font-bold">{`Step ${stepNumber}`}</div>

      {/* Title */}
      <div className="text-3xl font-bold text-foreground leading-tight">
        {titleComponent}
      </div>

      {children}

      {/* Action Button */}
      <Button
        onClick={onButtonClick}
        className="w-full h-16 rounded-2xl"
        size="lg"
      >
        {buttonText}
      </Button>
    </div>
  );
}
