import { Navigate, Route, Routes } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { HomePage } from "@/features/home/HomePage";
import { AuthPage } from "@/features/auth/AuthPage";
import { CourseCatalogPage } from "@/features/courses/CourseCatalogPage";
import { CourseDetailPage } from "@/features/courses/CourseDetailPage";
import { StudentDashboardPage } from "@/features/dashboard/StudentDashboardPage";
import { EnrollStubPage } from "@/features/enroll/EnrollStubPage";
import { TeacherComingSoonPage } from "@/features/teacher/TeacherComingSoonPage";
import { NotFoundPage } from "@/features/not-found/NotFoundPage";
import { useAuthStore } from "@/features/auth/auth.store";
import type { ReactNode } from "react";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const jwt = useAuthStore((s) => s.jwt);
  if (!jwt) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const jwt = useAuthStore((s) => s.jwt);
  if (jwt) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="courses" element={<CourseCatalogPage />} />
        <Route path="courses/:id" element={<CourseDetailPage />} />
        <Route path="enroll/:courseId" element={<EnrollStubPage />} />
        <Route path="teacher" element={<TeacherComingSoonPage />} />
        <Route
          path="login"
          element={
            <PublicOnlyRoute>
              <AuthPage />
            </PublicOnlyRoute>
          }
        />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboardPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
