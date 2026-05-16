import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Badge, Button, EmptyState, Input, Skeleton } from "@academy/ui";
import { Search, X, BookOpen } from "lucide-react";
import { CourseCard } from "./CourseCard";
import { useCategories, useCourses } from "@/entities/course/queries";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
type Level = (typeof LEVELS)[number];

export function CourseCatalogPage() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") ?? undefined;
  const level = (params.get("level") as Level | null) ?? undefined;
  const [search, setSearch] = useState(params.get("q") ?? "");

  const { data: categories } = useCategories();
  const { data: courses, isLoading } = useCourses({ category, level });

  const filtered = useMemo(() => {
    if (!courses) return [];
    const q = search.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.instructor?.name.toLowerCase().includes(q) ||
        c.category?.name.toLowerCase().includes(q),
    );
  }, [courses, search]);

  function setCategoryParam(slug: string | undefined) {
    const next = new URLSearchParams(params);
    if (slug) next.set("category", slug);
    else next.delete("category");
    setParams(next, { replace: true });
  }
  function setLevelParam(lvl: Level | undefined) {
    const next = new URLSearchParams(params);
    if (lvl) next.set("level", lvl);
    else next.delete("level");
    setParams(next, { replace: true });
  }

  return (
    <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin-desktop py-md md:py-lg">
      <div className="mb-md">
        <h1 className="font-serif text-headline-md text-on-surface mb-xs">All courses</h1>
        <p className="text-body-md text-on-surface-variant">
          Browse our curriculum across Quran, Hadith, Fiqh, and Arabic studies.
        </p>
      </div>

      <div className="sticky top-16 z-20 -mx-margin-mobile md:-mx-margin-desktop px-margin-mobile md:px-margin-desktop py-xs bg-background/95 backdrop-blur border-b border-outline-variant/40 mb-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses, instructors, topics..."
            className="pl-9 pr-9"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-base mt-xs overflow-x-auto pb-base">
          <button
            type="button"
            onClick={() => setCategoryParam(undefined)}
            className={`px-sm py-base rounded-full text-label-sm whitespace-nowrap border transition-colors ${
              !category
                ? "bg-primary text-on-primary border-primary"
                : "border-outline-variant text-on-surface-variant"
            }`}
          >
            All
          </button>
          {categories?.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoryParam(c.slug)}
              className={`px-sm py-base rounded-full text-label-sm whitespace-nowrap border transition-colors ${
                category === c.slug
                  ? "bg-primary text-on-primary border-primary"
                  : "border-outline-variant text-on-surface-variant"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-[200px_1fr] gap-md">
        <aside className="hidden md:block">
          <h3 className="text-label-lg text-on-surface mb-xs uppercase tracking-wider">Level</h3>
          <ul className="space-y-1">
            <li>
              <button
                type="button"
                onClick={() => setLevelParam(undefined)}
                className={`w-full text-left text-body-md py-base px-xs rounded ${
                  !level ? "bg-primary-fixed/40 text-primary" : "text-on-surface-variant"
                }`}
              >
                All levels
              </button>
            </li>
            {LEVELS.map((l) => (
              <li key={l}>
                <button
                  type="button"
                  onClick={() => setLevelParam(l)}
                  className={`w-full text-left text-body-md py-base px-xs rounded capitalize ${
                    level === l ? "bg-primary-fixed/40 text-primary" : "text-on-surface-variant"
                  }`}
                >
                  {l}
                </button>
              </li>
            ))}
          </ul>

          {(category || level || search) && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-md w-full"
              onClick={() => {
                setParams(new URLSearchParams(), { replace: true });
                setSearch("");
              }}
            >
              Clear filters
            </Button>
          )}
        </aside>

        <section>
          {(category || level) && (
            <div className="flex flex-wrap gap-base mb-sm">
              {category && (
                <Badge variant="outline">
                  Category: {category}
                  <button onClick={() => setCategoryParam(undefined)} aria-label="Remove">
                    <X className="w-3 h-3 ml-1" />
                  </button>
                </Badge>
              )}
              {level && (
                <Badge variant="outline">
                  Level: {level}
                  <button onClick={() => setLevelParam(undefined)} aria-label="Remove">
                    <X className="w-3 h-3 ml-1" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-md">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="w-12 h-12" />}
              title="No courses match these filters"
              description="Try clearing filters or searching for a different topic."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setParams(new URLSearchParams(), { replace: true });
                    setSearch("");
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-md">
              {filtered.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
