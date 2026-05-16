import { Link } from "react-router-dom";
import { Button } from "@academy/ui";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-margin-mobile">
      <div className="text-center max-w-md">
        <p className="font-serif text-display-lg-mobile md:text-display-lg text-primary mb-xs">
          404
        </p>
        <h1 className="font-serif text-headline-md text-on-surface mb-sm">Page not found</h1>
        <p className="text-body-md text-on-surface-variant mb-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button>Back to home</Button>
        </Link>
      </div>
    </div>
  );
}
