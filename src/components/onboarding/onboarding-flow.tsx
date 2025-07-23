"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/layout/onboarding-layout";
import { WelcomeScreen } from "./welcome-screen";
import { TimeSetup } from "./time-setup";
import { NotificationPermission } from "./notification-permission";
import { UserPreferences } from "@/lib/types";
import { DEFAULT_USER_PREFERENCES, STORAGE_KEYS } from "@/lib/constants";

export function OnboardingFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>(
    DEFAULT_USER_PREFERENCES
  );

  const handleGetStarted = () => {
    setCurrentStep(1);
  };

  const handleTimeSetup = (wakeUpTime: string, windDownTime: string) => {
    const updatedPreferences = {
      ...preferences,
      wakeUpTime,
      windDownTime,
    };
    setPreferences(updatedPreferences);
    // Save to localStorage
    localStorage.setItem(
      STORAGE_KEYS.USER_PREFERENCES,
      JSON.stringify(updatedPreferences)
    );
    setCurrentStep(2);
  };

  const handleNotificationPermission = () => {
    const finalPreferences = {
      ...preferences,
      notificationsEnabled: true,
      onboardingCompleted: true,
    };
    setPreferences(finalPreferences);
    // Save to localStorage
    localStorage.setItem(
      STORAGE_KEYS.USER_PREFERENCES,
      JSON.stringify(finalPreferences)
    );
    router.push("/timeline");
  };

  const handleSkip = () => {
    router.push("/timeline");
  };

  const steps = [
    {
      title: "Welcome",
      component: <WelcomeScreen onGetStarted={handleGetStarted} />,
    },
    {
      title: "Time Setup",
      component: <TimeSetup onContinue={handleTimeSetup} />,
    },
    {
      title: "Notification Permission",
      component: (
        <NotificationPermission onNext={handleNotificationPermission} />
      ),
    },
  ];

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const getLayoutProps = () => {
    const baseProps = {
      showSkip: currentStep !== 4,
      onSkip: handleSkip,
    };

    if (currentStep === 0) {
      return baseProps;
    }

    return {
      ...baseProps,
      showBack: true,
      onBack: handleBack,
    };
  };

  const renderCurrentStep = () => {
    return steps[currentStep].component;
  };

  return (
    <OnboardingLayout {...getLayoutProps()}>
      {renderCurrentStep()}
    </OnboardingLayout>
  );
}
