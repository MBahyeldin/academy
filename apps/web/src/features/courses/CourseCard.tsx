import { Link } from "react-router-dom";
import { Badge, Card, CardContent } from "@academy/ui";
import { Star, Clock } from "lucide-react";
import type { StrapiCourse } from "@academy/types";

export function CourseCard({ course }: { course: StrapiCourse }) {
  const lessonCount = (course.modules ?? []).reduce(
    (acc, m) => acc + (m.lessons?.length ?? 0),
    0,
  );
  const avgRating = course.reviews?.length
    ? course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length
    : course.instructor?.rating ?? 0;

  const strapiBaseUrl = (import.meta as { env?: Record<string, string> }).env?.VITE_STRAPI_URL || "http://localhost:1337";
  const thumbnailUrl = course.thumbnail ? `${strapiBaseUrl}${course.thumbnail.url}` : null;
  

  return (
    <Link to={`/courses/${course.documentId}`} className="group block focus:outline-none">
      <Card className="overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all h-full flex flex-col">
        <div className="aspect-[16/10] bg-gradient-to-br from-primary-container to-surface-tint relative mashrabiya-pattern">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={course.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-on-primary opacity-30">
              <span className="font-serif text-display-lg-mobile">
                {course.title.charAt(0)}
              </span>
            </div>
          )}
          {course.category && (
            <Badge variant="secondary" className="absolute top-xs left-xs">
              {course.category.name}
            </Badge>
          )}
        </div>
        <CardContent className="pt-sm flex-1 flex flex-col">
          <div className="flex items-center gap-xs text-label-sm text-on-surface-variant mb-base">
            <span className="capitalize">{course.level}</span>
            {lessonCount > 0 && (
              <>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-base">
                  <Clock className="w-3 h-3" />
                  {lessonCount} lessons
                </span>
              </>
            )}
          </div>
          <h3 className="font-serif text-headline-sm text-on-surface mb-xs line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          {course.instructor && (
            <p className="text-body-md text-on-surface-variant mb-sm">
              {course.instructor.name}
            </p>
          )}
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-base text-label-lg">
              <Star className="w-4 h-4 fill-secondary-container text-secondary-container" />
              <span className="text-on-surface">{avgRating.toFixed(1)}</span>
            </div>
            {course.price != null && (
              <span className="font-serif text-headline-sm text-primary">
                ${course.price}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
