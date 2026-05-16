import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Badge, Button, Card, CardContent, Skeleton, EmptyState } from "@academy/ui";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  PlayCircle,
  FileText,
  HelpCircle,
  Star,
  BookOpen,
} from "lucide-react";
import { useCourse } from "@/entities/course/queries";
import { formatDuration } from "@academy/utils";
import type { StrapiLesson, StrapiModule } from "@academy/types";

const TABS = ["about", "curriculum", "instructor", "reviews"] as const;
type Tab = (typeof TABS)[number];

export function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("about");
  const { data: course, isLoading } = useCourse(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin-desktop py-md space-y-md">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!course) {
    return (
      <EmptyState
        icon={<BookOpen className="w-12 h-12" />}
        title="Course not found"
        description="The course you're looking for doesn't exist or has been removed."
        action={
          <Link to="/courses">
            <Button>Back to courses</Button>
          </Link>
        }
      />
    );
  }

  const lessonCount = (course.modules ?? []).reduce(
    (acc, m) => acc + (m.lessons?.length ?? 0),
    0,
  );
  const totalMinutes = (course.modules ?? []).reduce(
    (acc, m) => acc + (m.lessons ?? []).reduce((a, l) => a + (l.durationMinutes ?? 0), 0),
    0,
  );
  const avgRating = course.reviews?.length
    ? course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length
    : course.instructor?.rating ?? 0;

  return (
    <>
      <section className="bg-primary text-on-primary mashrabiya-pattern">
        <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin-desktop py-lg">
          <nav aria-label="Breadcrumb" className="text-label-sm opacity-80 mb-sm">
            <ol className="flex items-center gap-base flex-wrap">
              <li>
                <Link to="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <ChevronRight className="w-3 h-3" />
              <li>
                <Link to="/courses" className="hover:underline">
                  Courses
                </Link>
              </li>
              <ChevronRight className="w-3 h-3" />
              <li aria-current="page" className="truncate max-w-[200px]">
                {course.title}
              </li>
            </ol>
          </nav>

          <div className="grid md:grid-cols-[1fr_280px] gap-md items-start">
            <div>
              {course.category && (
                <Badge variant="secondary" className="mb-sm">
                  {course.category.name}
                </Badge>
              )}
              <h1 className="font-serif text-display-lg-mobile md:text-headline-md mb-sm">
                {course.title}
              </h1>
              {course.description && (
                <div
                  className="text-body-lg opacity-90 mb-md max-w-2xl"
                  dangerouslySetInnerHTML={{ __html: course.description }}
                />
              )}
              <div className="flex flex-wrap gap-md text-body-md">
                <span className="inline-flex items-center gap-base">
                  <Star className="w-4 h-4 fill-secondary-container text-secondary-container" />
                  {avgRating.toFixed(1)} ({course.reviews?.length ?? 0} reviews)
                </span>
                <span className="inline-flex items-center gap-base">
                  <BookOpen className="w-4 h-4" />
                  {lessonCount} lessons
                </span>
                <span className="inline-flex items-center gap-base">
                  <Clock className="w-4 h-4" />
                  {formatDuration(totalMinutes)}
                </span>
                <span className="capitalize">Level: {course.level}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin-desktop py-md grid md:grid-cols-[1fr_320px] gap-md">
        <div>
          <div className="flex gap-base border-b border-outline-variant/40 mb-md overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-sm py-xs text-label-lg capitalize whitespace-nowrap border-b-2 transition-colors ${
                  tab === t
                    ? "border-primary text-primary"
                    : "border-transparent text-on-surface-variant"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "about" && (
            <div className="prose max-w-none text-body-md text-on-surface">
              {course.description ? (
                <div dangerouslySetInnerHTML={{ __html: course.description }} />
              ) : (
                <p className="text-on-surface-variant">No description provided yet.</p>
              )}
            </div>
          )}

          {tab === "curriculum" && (
            <CurriculumAccordion modules={course.modules ?? []} />
          )}

          {tab === "instructor" && course.instructor && (
            <Card>
              <CardContent className="pt-md flex flex-col md:flex-row gap-md">
                <div className="w-24 h-24 rounded-full bg-primary-fixed grid place-items-center text-on-primary-fixed font-serif text-headline-md">
                  {course.instructor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif text-headline-sm text-on-surface">
                    {course.instructor.name}
                  </h3>
                  <p className="text-body-md text-on-surface-variant mb-sm">
                    Rating: {course.instructor.rating?.toFixed(1) ?? "—"}
                  </p>
                  <p className="text-body-md text-on-surface">{course.instructor.bio}</p>
                  {course.instructor.expertise && course.instructor.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-base mt-sm">
                      {course.instructor.expertise.map((e) => (
                        <Badge key={e} variant="muted">
                          {e}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {tab === "reviews" && (
            <div className="space-y-sm">
              {course.reviews && course.reviews.length > 0 ? (
                course.reviews.map((r) => (
                  <Card key={r.id}>
                    <CardContent className="pt-sm">
                      <div className="flex items-center justify-between mb-base">
                        <p className="text-label-lg text-on-surface">{r.studentName}</p>
                        <div className="flex items-center gap-base">
                          <Star className="w-4 h-4 fill-secondary-container text-secondary-container" />
                          {r.rating}
                        </div>
                      </div>
                      <p className="text-body-md text-on-surface">{r.content}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-body-md text-on-surface-variant">
                  No reviews yet. Be the first to share your experience.
                </p>
              )}
            </div>
          )}
        </div>

        <aside className="md:sticky md:top-24 self-start">
          <Card>
            <CardContent className="pt-md">
              {course.price != null && (
                <div className="mb-sm">
                  <span className="font-serif text-display-lg-mobile text-primary">
                    ${course.price}
                  </span>
                  <span className="text-body-md text-on-surface-variant"> /one-time</span>
                </div>
              )}
              <Button
                className="w-full"
                size="lg"
                onClick={() => navigate(`/enroll/${course.id}`)}
              >
                Enroll now
              </Button>
              <ul className="mt-md space-y-base text-body-md text-on-surface-variant">
                <li className="flex items-center gap-xs">
                  <PlayCircle className="w-4 h-4 text-primary" /> {lessonCount} lessons
                </li>
                <li className="flex items-center gap-xs">
                  <Clock className="w-4 h-4 text-primary" /> {formatDuration(totalMinutes)} content
                </li>
                <li className="flex items-center gap-xs">
                  <FileText className="w-4 h-4 text-primary" /> Lifetime access
                </li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  );
}

function CurriculumAccordion({ modules }: { modules: StrapiModule[] }) {
  const [openId, setOpenId] = useState<number | null>(modules[0]?.id ?? null);
  if (modules.length === 0) {
    return (
      <p className="text-body-md text-on-surface-variant">
        Curriculum will be published soon.
      </p>
    );
  }
  return (
    <div className="space-y-base">
      {modules
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((mod, idx) => {
          const isOpen = openId === mod.id;
          return (
            <Card key={mod.id}>
              <button
                type="button"
                className="w-full px-md py-sm flex items-center justify-between text-left"
                onClick={() => setOpenId(isOpen ? null : mod.id)}
                aria-expanded={isOpen}
              >
                <span>
                  <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Module {idx + 1}
                  </span>
                  <h3 className="font-serif text-headline-sm text-on-surface">{mod.title}</h3>
                </span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <ul className="border-t border-outline-variant/40">
                  {(mod.lessons ?? [])
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((lesson) => (
                      <LessonRow key={lesson.id} lesson={lesson} />
                    ))}
                </ul>
              )}
            </Card>
          );
        })}
    </div>
  );
}

function LessonRow({ lesson }: { lesson: StrapiLesson }) {
  const Icon = lesson.type === "video" ? PlayCircle : lesson.type === "quiz" ? HelpCircle : FileText;
  return (
    <li className="px-md py-xs flex items-center justify-between text-body-md border-b last:border-b-0 border-outline-variant/30">
      <span className="flex items-center gap-xs text-on-surface">
        <Icon className="w-4 h-4 text-primary" />
        {lesson.title}
      </span>
      <span className="text-label-sm text-on-surface-variant">
        {lesson.durationMinutes ? formatDuration(lesson.durationMinutes) : null}
      </span>
    </li>
  );
}
