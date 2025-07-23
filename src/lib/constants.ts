import { TimelineItem, UserPreferences } from "./types";

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  wakeUpTime: "09:00",
  windDownTime: "22:00",
  notificationsEnabled: false,
  onboardingCompleted: false,
};

export const DEFAULT_TIMELINE_ITEMS: TimelineItem[] = [
  {
    id: "wake-up",
    title: "Wake up",
    icon: "sun",
    time: "09:00",
    completed: false,
    type: "system",
    color: "wake-up",
  },
  {
    id: "drink-water",
    title: "Drink water",
    icon: "droplets",
    completed: false,
    type: "habit",
  },
  {
    id: "take-break",
    title: "Take a break",
    icon: "coffee",
    completed: false,
    type: "habit",
  },
  {
    id: "wind-down",
    title: "Wind down",
    icon: "moon",
    time: "22:00",
    completed: false,
    type: "system",
    color: "wind-down",
  },
];

export const ONBOARDING_STEPS = [
  {
    id: "welcome",
    title: "Welcome to Joi",
    subtitle: "Tasks, meetings and habits in one timeline",
    path: "/",
  },
  {
    id: "time-setup",
    title: "Set your wake-up and wind-down hours",
    path: "/onboarding/step-1",
  },
  {
    id: "notifications",
    title: "Enable notifications to get updates for your day",
    path: "/onboarding/step-3",
  },
] as const;

export const STORAGE_KEYS = {
  USER_PREFERENCES: "joi-user-preferences",
  TIMELINE_DATA: "joi-timeline-data",
  ONBOARDING_STATE: "joi-onboarding-state",
} as const;
