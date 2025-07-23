"use client";

import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
      {/* Logo */}
      <Logo size="xl" className="mb-8" />

      {/* Welcome Text */}
      <div className="space-y-4 max-w-sm">
        <h1 className="text-2xl font-bold text-foreground">Welcome to Joi</h1>
        <p className="text-4xl font-bold text-foreground leading-tight">
          Tasks, meetings and habits in one timeline
        </p>
      </div>

      {/* Get Started Button */}
      <div className="w-full max-w-sm pt-8">
        <Button onClick={onGetStarted} className="w-full" size="lg">
          Get started
        </Button>
      </div>
    </div>
  );
}
