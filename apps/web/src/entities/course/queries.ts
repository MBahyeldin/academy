import { useQuery } from "@tanstack/react-query";
import { strapiClient, type GetCoursesParams } from "@academy/api-client";

export function useCourses(params: GetCoursesParams = {}) {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: () => strapiClient.getCourses(params),
  });
}

export function useCourse(id: string | number | undefined) {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => strapiClient.getCourse(id!),
    enabled: id !== undefined,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => strapiClient.getCategories(),
    staleTime: 5 * 60 * 1000,
  });
}
