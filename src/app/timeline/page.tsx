import { AppLayout } from "@/components/layout/app-layout";
import { DailyTimeline } from "@/components/timeline/daily-timeline";

export default function TimelinePage() {
  return (
    <AppLayout>
      <DailyTimeline />
    </AppLayout>
  );
}
