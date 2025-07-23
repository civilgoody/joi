export interface UserPreferences {
  wakeUpTime: string; // "09:00"
  windDownTime: string; // "22:00"
  notificationsEnabled: boolean;
  onboardingCompleted: boolean;
}

export interface TimelineItem {
  id: string;
  title: string;
  icon: string; // Icon identifier
  time?: string; // Optional time
  completed: boolean;
  type: "habit" | "task" | "meeting" | "system";
  color?: string; // Custom color
}

export interface DailyTimeline {
  date: string; // "2025-07-19"
  items: TimelineItem[];
}

export interface OnboardingStep {
  id: string;
  title: string;
  subtitle?: string;
  component: string;
  completed: boolean;
}
