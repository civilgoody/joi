"use client";

import { useState } from "react";
import { Plus, Sun, Droplets, Coffee, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DEFAULT_TIMELINE_ITEMS } from "@/lib/constants";
import { TimelineItem } from "@/lib/types";

const iconMap = {
  sun: Sun,
  droplets: Droplets,
  coffee: Coffee,
  moon: Moon,
};

interface DailyTimelineProps {
  date?: Date;
  items?: TimelineItem[];
}

export function DailyTimeline({
  date = new Date("2025-07-19"),
  items = DEFAULT_TIMELINE_ITEMS,
}: DailyTimelineProps) {
  const [currentDate] = useState(date);
  const [timelineItems] = useState(items);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const getDayName = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const getWeekDays = (currentDate: Date) => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - 3); // Show 3 days before

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays(currentDate);

  return (
    <div className="space-y-6">
      {/* Date Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">{getDayName(currentDate)}</h1>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">
            {formatDate(currentDate).replace(getDayName(currentDate) + " ", "")}
          </div>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-center space-x-4">
        {weekDays.map((day, index) => {
          const isSelected = day.toDateString() === currentDate.toDateString();
          const dayNum = day.getDate();
          const dayName = day
            .toLocaleDateString("en-US", { weekday: "short" })
            .toUpperCase();

          return (
            <button
              key={index}
              className={`text-center space-y-1 transition-colors ${
                isSelected ? "" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="text-xs font-medium">{dayNum}</div>
              <div className="text-xs">{dayName}</div>
              {isSelected && (
                <div className="w-1 h-1 bg-joi-orange rounded-full mx-auto"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Timeline Items */}
      <Card className="p-6">
        <div className="space-y-4">
          {timelineItems.map((item) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap];
            const hasTime = !!item.time;

            return (
              <div
                key={item.id}
                className="flex items-center space-x-4 py-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                {/* Icon */}
                <div
                  className={`p-2 rounded-full ${
                    item.color === "wake-up"
                      ? "bg-wake-up/10"
                      : item.color === "wind-down"
                      ? "bg-wind-down/10"
                      : "bg-muted"
                  }`}
                >
                  {IconComponent && (
                    <IconComponent
                      className={`h-6 w-6 ${
                        item.color === "wake-up"
                          ? "text-wake-up"
                          : item.color === "wind-down"
                          ? "text-wind-down"
                          : "text-muted-foreground"
                      }`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="text-lg font-medium">{item.title}</div>
                </div>

                {/* Time */}
                {hasTime && (
                  <div className="text-lg font-medium text-muted-foreground">
                    {item.time}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Add Button */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <Button size="icon" className="rounded-full w-14 h-14 shadow-lg">
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Bottom Navigation Indicators */}
      <div className="flex items-center justify-center space-x-8 pt-8 pb-4">
        <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
          <div className="w-4 h-4 rounded-full bg-foreground"></div>
        </button>
        <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
          <Plus className="h-4 w-4 text-muted-foreground" />
        </button>
        <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
          <div className="w-4 h-4 text-muted-foreground">←</div>
        </button>
      </div>
    </div>
  );
}
