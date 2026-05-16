import { Link } from "react-router-dom";
import { Badge, Button, Card, CardContent, Skeleton } from "@academy/ui";
import { useCourses } from "@/entities/course/queries";
import { CourseCard } from "@/features/courses/CourseCard";
import { ArrowRight, BookOpen, Users, Award, Sparkles } from "lucide-react";

const HIGHLIGHTS = [
  {
    Icon: BookOpen,
    title: "Authentic Curriculum",
    description: "Course content rooted in classical scholarship and reviewed by certified scholars.",
  },
  {
    Icon: Users,
    title: "Live Scholar Q&A",
    description: "Connect with instructors through live sessions and structured Q&A.",
  },
  {
    Icon: Award,
    title: "Recognized Certificates",
    description: "Earn certificates upon course completion to mark your scholarly progress.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "The Tajweed course transformed my recitation. The pacing was perfect and the instructor's feedback invaluable.",
    name: "Aisha R.",
    role: "Student, UK",
  },
  {
    quote:
      "I had studied Fiqh for years, but Dr. Fatima's structured approach finally made the foundations click.",
    name: "Omar K.",
    role: "Student, Canada",
  },
  {
    quote:
      "Beautifully designed platform. It feels respectful of the tradition while genuinely modern.",
    name: "Maryam S.",
    role: "Student, Malaysia",
  },
];

const STATS = [
  { value: "15,000+", label: "Students" },
  { value: "50+", label: "Scholars" },
  { value: "120+", label: "Courses" },
];

export function HomePage() {
  const { data: courses, isLoading } = useCourses({ limit: 6 });

  return (
    <>
      <section className="relative overflow-hidden mashrabiya-pattern">
        <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin-desktop py-xl md:py-[96px] grid md:grid-cols-2 gap-lg items-center">
          <div>
            <Badge variant="muted" className="mb-md">
              <Sparkles className="w-3.5 h-3.5" />
              New sprint • 6 courses live
            </Badge>
            <h1 className="font-serif text-display-lg-mobile md:text-display-lg text-on-surface mb-sm">
              Where tradition meets <span className="text-primary">modern learning</span>
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-xl mb-md">
              A bilingual platform for Quranic and Islamic studies. Learn from certified scholars
              at your own pace, with curriculum designed for the modern student.
            </p>
            <p
              dir="rtl"
              lang="ar"
              className="arabic-content text-body-lg text-on-surface-variant mb-lg"
            >
              العلم نور — اطلبه أينما كنت
            </p>
            <div className="flex flex-wrap gap-xs">
              <Link to="/courses">
                <Button size="lg">
                  Browse courses
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login?mode=register">
                <Button variant="outline" size="lg">
                  Start free
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-xl bg-gradient-to-br from-primary to-primary-container shadow-lg overflow-hidden mashrabiya-pattern">
              <div className="absolute inset-0 grid place-items-center p-lg bg-primary">
                <div className="text-center text-on-primary">
                  <p className="arabic-content text-headline-md mb-sm" dir="rtl" lang="ar">
                    اقرأ باسم ربك الذي خلق
                  </p>
                  <p className="text-body-md opacity-80">Read in the name of your Lord — Quran 96:1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-margin-mobile md:px-margin-desktop py-xl">
        <h2 className="font-serif text-headline-md text-on-surface mb-md text-center">
          Why choose Modern Islamic Academy
        </h2>
        <div className="grid md:grid-cols-3 gap-md">
          {HIGHLIGHTS.map(({ Icon, title, description }) => (
            <Card key={title}>
              <CardContent className="pt-md">
                <div className="w-12 h-12 rounded-lg bg-primary-fixed grid place-items-center mb-sm">
                  <Icon className="w-6 h-6 text-on-primary-fixed" />
                </div>
                <h3 className="font-serif text-headline-sm text-on-surface mb-xs">{title}</h3>
                <p className="text-body-md text-on-surface-variant">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-surface-container-low">
        <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin-desktop py-xl">
          <div className="flex items-end justify-between mb-md">
            <div>
              <h2 className="font-serif text-headline-md text-on-surface">Featured courses</h2>
              <p className="text-body-md text-on-surface-variant">
                Hand-picked introductions across the Islamic sciences.
              </p>
            </div>
            <Link
              to="/courses"
              className="hidden md:inline-flex items-center gap-base text-label-lg text-primary hover:underline"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-md">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-md">
              {courses.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          ) : (
            <p className="text-body-md text-on-surface-variant text-center py-lg">
              No courses available yet. Check back after seeding the CMS.
            </p>
          )}

          <div className="md:hidden mt-md text-center">
            <Link to="/courses">
              <Button variant="outline">View all courses</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-margin-mobile md:px-margin-desktop py-xl">
        <h2 className="font-serif text-headline-md text-on-surface mb-md text-center">
          What our students say
        </h2>
        <div className="grid md:grid-cols-3 gap-md">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name}>
              <CardContent className="pt-md">
                <p className="text-body-md text-on-surface mb-sm">"{t.quote}"</p>
                <div className="border-t border-outline-variant/40 pt-sm">
                  <p className="text-label-lg text-on-surface">{t.name}</p>
                  <p className="text-label-sm text-on-surface-variant">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-primary text-on-primary mashrabiya-pattern">
        <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin-desktop py-lg grid grid-cols-3 gap-md text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-serif text-display-lg-mobile md:text-display-lg">{s.value}</p>
              <p className="text-label-lg uppercase tracking-wider opacity-80">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
