import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Card, CardContent, Input } from "@academy/ui";
import { strapiClient, apiClient } from "@academy/api-client";
import { useAuthStore } from "./auth.store";
import { BookOpen, Lock, Mail, User as UserIcon } from "lucide-react";

const loginSchema = z.object({
  identifier: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z
  .object({
    username: z.string().min(3, "At least 3 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "At least 8 characters"),
  })
  .strict();

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export function AuthPage() {
  const [params] = useSearchParams();
  const initialMode = params.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [serverError, setServerError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const loginForm = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  async function onLogin(values: LoginValues) {
    setServerError(null);
    try {
      const { jwt, user } = await strapiClient.login(values.identifier, values.password);
      setAuth(jwt, user, "student");
      try {
        await apiClient.syncUser();
      } catch {
        // Sync is best-effort; dashboard will retry.
      }
      navigate("/dashboard");
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Login failed");
    }
  }

  async function onRegister(values: RegisterValues) {
    setServerError(null);
    try {
      const { jwt, user } = await strapiClient.register(
        values.username,
        values.email,
        values.password,
      );
      setAuth(jwt, user, "student");
      try {
        await apiClient.syncUser();
      } catch {
        // Best effort.
      }
      navigate("/dashboard");
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Registration failed");
    }
  }

  function comingSoon() {
    setToast("Coming soon — check back next sprint!");
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid md:grid-cols-2">
      {/* Left branding panel (desktop only) */}
      <aside className="hidden md:flex bg-primary text-on-primary mashrabiya-pattern p-margin-desktop flex-col justify-between">
        <div className="flex items-center gap-xs">
          <span className="grid place-items-center w-10 h-10 rounded-md bg-on-primary text-primary">
            <BookOpen className="w-5 h-5" />
          </span>
          <span className="font-serif text-headline-sm">Modern Islamic Academy</span>
        </div>
        <div>
          <p
            dir="rtl"
            lang="ar"
            className="arabic-content text-headline-md mb-md"
          >
            وَقُل رَّبِّ زِدْنِي عِلْمًا
          </p>
          <p className="font-serif text-headline-sm mb-xs">"My Lord, increase me in knowledge."</p>
          <p className="text-body-md opacity-80">Quran 20:114</p>
        </div>
        <p className="text-body-md opacity-70">
          Join 15,000+ students learning Quran, Hadith, Fiqh and Arabic with certified scholars.
        </p>
      </aside>

      {/* Right form panel */}
      <section className="flex items-center justify-center p-margin-mobile md:p-margin-desktop">
        <Card className="w-full max-w-md">
          <CardContent className="pt-md">
            <div className="md:hidden flex items-center gap-xs mb-md">
              <span className="grid place-items-center w-9 h-9 rounded-md bg-primary text-on-primary">
                <BookOpen className="w-5 h-5" />
              </span>
              <span className="font-serif text-headline-sm text-on-surface">
                Modern Islamic Academy
              </span>
            </div>

            <h1 className="font-serif text-headline-md text-on-surface mb-xs">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-body-md text-on-surface-variant mb-md">
              {mode === "login"
                ? "Sign in to continue your studies."
                : "Start learning today — free forever to browse."}
            </p>

            {/* Mode toggle */}
            <div className="flex bg-surface-container rounded p-base mb-md">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`flex-1 py-xs text-label-lg rounded transition-colors ${
                    mode === m
                      ? "bg-surface-container-lowest text-primary shadow-sm"
                      : "text-on-surface-variant"
                  }`}
                >
                  {m === "login" ? "Log in" : "Sign up"}
                </button>
              ))}
            </div>

            {/* Role toggle */}
            <div className="flex gap-xs mb-md text-label-sm" role="tablist">
              {(["student", "teacher"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  role="tab"
                  aria-selected={role === r}
                  onClick={() => {
                    if (r === "teacher") {
                      comingSoon();
                      return;
                    }
                    setRole(r);
                  }}
                  className={`flex-1 py-xs px-sm rounded border ${
                    role === r
                      ? "border-primary text-primary bg-primary-fixed/30"
                      : "border-outline-variant text-on-surface-variant"
                  }`}
                >
                  {r === "student" ? "I'm a student" : "I'm a teacher (soon)"}
                </button>
              ))}
            </div>

            {serverError && (
              <div
                role="alert"
                className="mb-sm p-xs rounded bg-error-container text-on-error-container text-body-md"
              >
                {serverError}
              </div>
            )}

            {mode === "login" ? (
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="flex flex-col gap-sm">
                <label className="flex flex-col gap-base">
                  <span className="text-label-lg text-on-surface">Email</span>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="pl-9"
                      {...loginForm.register("identifier")}
                    />
                  </div>
                  {loginForm.formState.errors.identifier && (
                    <span className="text-label-sm text-error">
                      {loginForm.formState.errors.identifier.message}
                    </span>
                  )}
                </label>
                <label className="flex flex-col gap-base">
                  <span className="text-label-lg text-on-surface">Password</span>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <Input
                      type="password"
                      autoComplete="current-password"
                      className="pl-9"
                      {...loginForm.register("password")}
                    />
                  </div>
                  {loginForm.formState.errors.password && (
                    <span className="text-label-sm text-error">
                      {loginForm.formState.errors.password.message}
                    </span>
                  )}
                </label>
                <Button type="submit" size="lg" disabled={loginForm.formState.isSubmitting}>
                  {loginForm.formState.isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            ) : (
              <form
                onSubmit={registerForm.handleSubmit(onRegister)}
                className="flex flex-col gap-sm"
              >
                <label className="flex flex-col gap-base">
                  <span className="text-label-lg text-on-surface">Username</span>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <Input
                      autoComplete="username"
                      className="pl-9"
                      {...registerForm.register("username")}
                    />
                  </div>
                  {registerForm.formState.errors.username && (
                    <span className="text-label-sm text-error">
                      {registerForm.formState.errors.username.message}
                    </span>
                  )}
                </label>
                <label className="flex flex-col gap-base">
                  <span className="text-label-lg text-on-surface">Email</span>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <Input
                      type="email"
                      autoComplete="email"
                      className="pl-9"
                      {...registerForm.register("email")}
                    />
                  </div>
                  {registerForm.formState.errors.email && (
                    <span className="text-label-sm text-error">
                      {registerForm.formState.errors.email.message}
                    </span>
                  )}
                </label>
                <label className="flex flex-col gap-base">
                  <span className="text-label-lg text-on-surface">Password</span>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <Input
                      type="password"
                      autoComplete="new-password"
                      className="pl-9"
                      {...registerForm.register("password")}
                    />
                  </div>
                  {registerForm.formState.errors.password && (
                    <span className="text-label-sm text-error">
                      {registerForm.formState.errors.password.message}
                    </span>
                  )}
                </label>
                <Button type="submit" size="lg" disabled={registerForm.formState.isSubmitting}>
                  {registerForm.formState.isSubmitting ? "Creating account..." : "Create account"}
                </Button>
              </form>
            )}

            <div className="flex items-center gap-xs my-md">
              <div className="flex-1 h-px bg-outline-variant" />
              <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">
                or
              </span>
              <div className="flex-1 h-px bg-outline-variant" />
            </div>

            <div className="flex flex-col gap-xs">
              <Button variant="outline" onClick={comingSoon} type="button">
                Continue with Google
              </Button>
              <Button variant="outline" onClick={comingSoon} type="button">
                Continue with Facebook
              </Button>
            </div>

            {toast && (
              <div
                role="status"
                className="mt-sm p-xs rounded bg-secondary-fixed text-on-secondary-fixed text-body-md text-center"
              >
                {toast}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
