import { useMemo } from "react";
import type { StudySession } from "@academy/types";

export function StudyHoursChart({ sessions }: { sessions: StudySession[] }) {
  const days = useMemo(() => {
    const now = new Date();
    const out: { label: string; date: string; minutes: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      const minutes = sessions.reduce((acc, s) => {
        const sd = new Date(s.date);
        return sd >= d && sd < next ? acc + s.durationMinutes : acc;
      }, 0);
      out.push({
        label: d.toLocaleDateString("en-US", { weekday: "short" }).charAt(0),
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        minutes,
      });
    }
    return out;
  }, [sessions]);

  const max = Math.max(60, ...days.map((d) => d.minutes));

  return (
    <div>
      <div className="flex items-end gap-base h-32" aria-hidden>
        {days.map((d, i) => {
          const heightPct = (d.minutes / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-base">
              <div
                className="w-full bg-secondary-container rounded-sm transition-all hover:bg-secondary"
                style={{ height: `${heightPct}%`, minHeight: d.minutes > 0 ? "4px" : "0" }}
                title={`${d.date}: ${d.minutes} min`}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-base mt-base">
        {days.map((d, i) => (
          <span
            key={i}
            className="flex-1 text-center text-label-sm text-on-surface-variant"
          >
            {d.label}
          </span>
        ))}
      </div>
      <p className="text-label-sm text-on-surface-variant mt-xs">
        Last 14 days · peak {max} min
      </p>
    </div>
  );
}
