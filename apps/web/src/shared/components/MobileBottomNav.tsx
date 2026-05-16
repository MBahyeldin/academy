import { NavLink } from "react-router-dom";
import { Home, BookOpen, LayoutDashboard, User } from "lucide-react";
import { useAuthStore } from "@/features/auth/auth.store";

const items = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/courses", label: "Courses", Icon: BookOpen },
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard, requiresAuth: true },
  { to: "/login", label: "Account", Icon: User, hideWhenAuthed: false },
];

export function MobileBottomNav() {
  const jwt = useAuthStore((s) => s.jwt);
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-surface-container-lowest border-t border-outline-variant/40">
      <div className="grid grid-cols-4">
        {items.map(({ to, label, Icon, requiresAuth }) => {
          if (requiresAuth && !jwt) return null;
          return (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-xs text-label-sm ${
                  isActive ? "text-primary" : "text-on-surface-variant"
                }`
              }
            >
              <Icon className="w-5 h-5 mb-base" />
              {label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
