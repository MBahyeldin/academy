import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@academy/ui";
import { useAuthStore } from "@/features/auth/auth.store";
import { BookOpen, LogOut, User } from "lucide-react";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/dashboard", label: "Dashboard" },
];

export function SiteHeader() {
  const navigate = useNavigate();
  const { jwt, user, clearAuth } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleLogout() {
    clearAuth();
    navigate("/");
  }

  return (
    <header
      className={`sticky top-0 z-30 border-b border-outline-variant/40 backdrop-blur transition-colors duration-300 ${
        scrolled ? "bg-background text-on-surface" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin-desktop h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-xs group">
          <span className="grid place-items-center w-9 h-9 rounded-md bg-primary text-on-primary">
            <BookOpen className="w-5 h-5" />
          </span>
          <span className="font-serif text-sm md:text-headline-sm text-on-surface group-hover:text-primary transition-colors">
            Modern Islamic Academy
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-md">
          {navItems.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                `text-label-lg ${
                  isActive ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-xs">
          {jwt ? (
            <>
              <span className="hidden md:flex items-center gap-xs text-xs md:text-body-md text-on-surface-variant">
                <User className="w-4 h-4" />
                {user?.username ?? "Student"}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout} aria-label="Log out">
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Log out</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                <span className="text-xs md:text-label-lg whitespace-nowrap">Log in</span>
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate("/login?mode=register")}>
                <span className="text-xs md:text-label-lg whitespace-nowrap">Sign up</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
