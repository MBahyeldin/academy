import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="border-t border-outline-variant/40 bg-surface-container-low mt-xl">
      <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin-desktop py-lg grid grid-cols-2 md:grid-cols-4 gap-md">
        <div className="col-span-2">
          <h3 className="font-serif text-headline-sm text-on-surface mb-xs">
            Modern Islamic Academy
          </h3>
          <p className="text-body-md text-on-surface-variant max-w-sm">
            Quranic and Islamic Studies — bringing centuries of scholarly tradition to a modern
            learning platform.
          </p>
        </div>
        <div>
          <h4 className="text-label-lg text-on-surface mb-xs uppercase tracking-wider">Learn</h4>
          <ul className="space-y-1 text-body-md text-on-surface-variant">
            <li>
              <Link to="/courses" className="hover:text-primary">
                Courses
              </Link>
            </li>
            <li>
              <Link to="/courses?category=quran" className="hover:text-primary">
                Quran
              </Link>
            </li>
            <li>
              <Link to="/courses?category=fiqh" className="hover:text-primary">
                Fiqh
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-label-lg text-on-surface mb-xs uppercase tracking-wider">Academy</h4>
          <ul className="space-y-1 text-body-md text-on-surface-variant">
            <li>
              <Link to="/teacher" className="hover:text-primary">
                Teach with us
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-primary">
                Sign in
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-outline-variant/40">
        <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin-desktop py-sm text-label-sm text-on-surface-variant flex items-center justify-between">
          <span>© {new Date().getFullYear()} Modern Islamic Academy</span>
          <span className="arabic-content text-label-sm">بسم الله</span>
        </div>
      </div>
    </footer>
  );
}
