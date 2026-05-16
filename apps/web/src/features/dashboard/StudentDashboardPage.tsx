import { Link } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Progress,
  Skeleton,
} from "@academy/ui";
import {
  Award,
  Bell,
  BookOpen,
  CalendarClock,
  Flame,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { useDashboard } from "@/entities/progress/queries";
import { useCourses } from "@/entities/course/queries";
import { useAuthStore } from "@/features/auth/auth.store";
import { formatDuration, relativeTime } from "@academy/utils";
import { StudyHoursChart } from "./StudyHoursChart";

const ACHIEVEMENT_META: Record<string, { label: string; Icon: typeof Award }> = {
  first_lesson: { label: "First Lesson", Icon: BookOpen },
  "7_day_streak": { label: "7-Day Streak", Icon: Flame },
  "30_day_streak": { label: "30-Day Streak", Icon: Flame },
  course_completed: { label: "Course Completed", Icon: Trophy },
  first_quiz: { label: "First Quiz", Icon: Award },
};

export function StudentDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const dashQuery = useDashboard();
  const coursesQuery = useCourses();

  if (dashQuery.isLoading || coursesQuery.isLoading) {
    return <DashboardSkeleton />;
  }

  const dashboard = dashQuery.data;
  const allCourses = coursesQuery.data ?? [];

  if (!dashboard || dashboard.progress.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin-desktop py-md">
        <EmptyState
          icon={<BookOpen className="w-12 h-12" />}
          title={`Welcome, ${user?.username ?? "student"}!`}
          description="You're not enrolled in any courses yet. Browse the catalog to get started."
          action={
            <Link to="/courses">
              <Button>Browse courses</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const enrolled = dashboard.progress.map((p) => {
    const course = allCourses.find((c) => c.id === p.courseId);
    return { progress: p, course };
  });

  const nextUp = [...enrolled].sort(
    (a, b) => a.progress.percentage - b.progress.percentage,
  )[0];

  const totalCourses = enrolled.length;
  const avgCompletion = Math.round(
    dashboard.progress.reduce((acc, p) => acc + p.percentage, 0) / dashboard.progress.length,
  );
  const totalHours =
    Math.round((dashboard.studyHours.reduce((acc, s) => acc + s.durationMinutes, 0) / 60) * 10) /
    10;

  return (
    <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin-desktop py-md md:py-lg space-y-md">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-xs">
        <div>
          <p className="text-label-lg text-on-surface-variant uppercase tracking-wider">
            Dashboard
          </p>
          <h1 className="font-serif text-headline-md text-on-surface">
            Welcome back, {user?.username ?? "student"}
          </h1>
        </div>
        <Link to="/courses">
          <Button variant="outline">
            Browse more <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </header>

      {nextUp?.course && (
        <Card className="bg-primary text-on-primary mashrabiya-pattern">
          <CardContent className="pt-md flex flex-col md:flex-row md:items-center gap-md">
            <div className="flex-1">
              <p className="text-label-lg uppercase tracking-wider opacity-80 mb-base">
                Pick up where you left off
              </p>
              <h2 className="font-serif text-headline-sm mb-base">{nextUp.course.title}</h2>
              <p className="text-body-md opacity-90 mb-sm">
                <CalendarClock className="inline w-4 h-4 mr-base align-text-bottom" />
                Next session: Sunday at 8:00 PM
              </p>
              <Progress
                value={nextUp.progress.percentage}
                className="max-w-md [&_*]:!text-on-primary"
              />
            </div>
            <Link to={`/courses/${nextUp.course.id}`}>
              <Button variant="gold" size="lg">
                Continue lesson
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-sm">
        <StatCard
          label="Enrolled courses"
          value={String(totalCourses)}
          Icon={BookOpen}
        />
        <StatCard
          label="Avg. completion"
          value={`${avgCompletion}%`}
          Icon={Trophy}
        />
        <StatCard
          label="Study hours"
          value={`${totalHours}h`}
          Icon={Flame}
        />
      </div>

      <div className="grid md:grid-cols-[2fr_1fr] gap-md">
        <Card>
          <CardHeader>
            <CardTitle>Study hours this month</CardTitle>
          </CardHeader>
          <CardContent>
            <StudyHoursChart sessions={dashboard.studyHours} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-xs">
              <Bell className="w-5 h-5 text-primary" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard.notifications.length === 0 ? (
              <p className="text-body-md text-on-surface-variant">No notifications yet.</p>
            ) : (
              <ul className="space-y-xs">
                {dashboard.notifications.slice(0, 5).map((n) => (
                  <li key={n.id} className="flex gap-xs items-start">
                    <span
                      aria-hidden
                      className={`mt-1 inline-block w-2 h-2 rounded-full flex-shrink-0 ${
                        n.type === "warning"
                          ? "bg-error"
                          : n.type === "success"
                            ? "bg-primary"
                            : "bg-secondary-container"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-body-md text-on-surface">{n.message}</p>
                      <p className="text-label-sm text-on-surface-variant">
                        {relativeTime(n.createdAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-sm">
            {enrolled.map(({ progress, course }) => (
              <Card key={progress.courseId} className="bg-surface-container-low">
                <CardContent className="pt-sm">
                  <div className="flex items-start justify-between mb-base">
                    <div>
                      <h3 className="font-serif text-headline-sm text-on-surface line-clamp-2">
                        {course?.title ?? `Course #${progress.courseId}`}
                      </h3>
                      {course?.instructor && (
                        <p className="text-body-md text-on-surface-variant">
                          {course.instructor.name}
                        </p>
                      )}
                    </div>
                    {course?.category && (
                      <Badge variant="muted">{course.category.name}</Badge>
                    )}
                  </div>
                  <Progress value={progress.percentage} label="Progress" className="mb-sm" />
                  <p className="text-label-sm text-on-surface-variant">
                    Last studied {relativeTime(progress.lastStudiedAt)} ·{" "}
                    {formatDuration(
                      dashboard.studyHours
                        .filter((s) => s.courseId === progress.courseId)
                        .reduce((acc, s) => acc + s.durationMinutes, 0),
                    )}{" "}
                    total
                  </p>
                  {course && (
                    <Link
                      to={`/courses/${course.id}`}
                      className="inline-flex items-center gap-base mt-xs text-label-lg text-primary hover:underline"
                    >
                      Open course <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-xs">
            <Trophy className="w-5 h-5 text-secondary-container" /> Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dashboard.achievements.length === 0 ? (
            <p className="text-body-md text-on-surface-variant">
              Keep studying to earn your first achievement!
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
              {dashboard.achievements.map((a) => {
                const meta = ACHIEVEMENT_META[a.type] ?? {
                  label: a.type,
                  Icon: Award,
                };
                const Icon = meta.Icon;
                return (
                  <div
                    key={a.id}
                    className="flex flex-col items-center text-center p-sm rounded-lg bg-secondary-fixed/50"
                  >
                    <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container grid place-items-center mb-base">
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-label-lg text-on-surface">{meta.label}</p>
                    <p className="text-label-sm text-on-surface-variant">
                      {relativeTime(a.awardedAt)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string;
  Icon: typeof BookOpen;
}) {
  return (
    <Card>
      <CardContent className="pt-sm flex items-center gap-xs">
        <div className="w-12 h-12 rounded-lg bg-primary-fixed grid place-items-center text-on-primary-fixed">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">{label}</p>
          <p className="font-serif text-headline-sm text-on-surface">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin-desktop py-md space-y-md">
      <Skeleton className="h-24 w-full" />
      <div className="grid grid-cols-3 gap-sm">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
