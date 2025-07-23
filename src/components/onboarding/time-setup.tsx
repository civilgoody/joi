"use client";

import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_USER_PREFERENCES } from "@/lib/constants";
import { LuSunrise } from "react-icons/lu";
import { OnboardingStepLayout } from "./onboarding-step-layout";

interface TimeSetupProps {
  onContinue: (wakeUpTime: string, windDownTime: string) => void;
}

export function TimeSetup({ onContinue }: TimeSetupProps) {
  const [wakeUpTime, setWakeUpTime] = useState(
    DEFAULT_USER_PREFERENCES.wakeUpTime
  );
  const [windDownTime, setWindDownTime] = useState(
    DEFAULT_USER_PREFERENCES.windDownTime
  );

  const handleContinue = () => {
    onContinue(wakeUpTime, windDownTime);
  };

  return (
    <OnboardingStepLayout
      stepNumber="1"
      titleComponent={
        <h1>
          Set your{" "}
          <span className="inline-flex items-center gap-1">
            <LuSunrise className="h-8 w-8" />
            wake-up
          </span>
          <br />
          and{" "}
          <span className="inline-flex items-center gap-1">
            <Moon className="h-8 w-8" fill="currentColor" />
            wind-down
          </span>
          <br />
          hours
        </h1>
      }
      buttonText="Continue"
      onButtonClick={handleContinue}
    >
      {/* Time Inputs */}
      <div className="space-y-6 mb-16">
        {/* Wake up time */}
        <div className="flex items-center justify-between bg-zinc-100 shadow-sm p-4 rounded-lg">
          <div className="flex items-center gap-3">
            {/* <LuSunrise className="h-6 w-6" /> */}
            <Label htmlFor="wake-up-time" className="text-lg font-bold">
              Wake up
            </Label>
          </div>
          <Input
            id="wake-up-time"
            type="time"
            value={wakeUpTime}
            onChange={(e) => setWakeUpTime(e.target.value)}
            className="w-28 text-lg font-medium text-right bg-zinc-200 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>

        {/* Wind down time */}
        <div className="flex items-center justify-between bg-zinc-100 shadow-sm p-4 rounded-lg">
          <div className="flex items-center gap-3">
            {/* <Moon className="h-6 w-6" fill="currentColor" /> */}
            <Label htmlFor="wind-down-time" className="text-lg font-bold">
              Wind down
            </Label>
          </div>
          <Input
            id="wind-down-time"
            type="time"
            value={windDownTime}
            onChange={(e) => setWindDownTime(e.target.value)}
            className="w-28 text-lg font-medium text-right bg-zinc-200 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
      </div>
    </OnboardingStepLayout>
  );
}
