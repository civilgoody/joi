"use client";

import { OnboardingStepLayout } from "./onboarding-step-layout";
import { LuBell } from "react-icons/lu";

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
    <OnboardingStepLayout
      stepNumber="3"
      titleComponent={
        <h1>
          <span className="block">
            Enable{" "}
            <span className="inline-flex items-center gap-2">
              <LuBell className="h-8 w-8 fill-black" />
            </span>{" "}
          </span>
          notifications to get updates for your day
        </h1>
      }
      buttonText="Next"
      onButtonClick={handleNext}
    />
  );
}
