"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationPermissionProps {
  onNext: () => void;
}

export function NotificationPermission({
  onNext,
}: NotificationPermissionProps) {
  const handleNext = () => {
    // TODO: Request notification permission
    onNext();
  };

  return (
    <div className="flex-1 flex flex-col justify-center space-y-8">
      {/* Step indicator */}
      <div className="text-muted-foreground text-sm font-medium">Step 3</div>

      {/* Title */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground leading-tight">
          Enable{" "}
          <span className="inline-flex items-center gap-2">
            <Bell className="h-8 w-8" />
            notifications
          </span>{" "}
          to get updates for your day
        </h1>
      </div>

      {/* Next Button */}
      <Button onClick={handleNext} className="w-full" size="lg">
        Next
      </Button>
    </div>
  );
}
