import { Link } from "react-router-dom";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@academy/ui";
import { GraduationCap } from "lucide-react";

export function TeacherComingSoonPage() {
  return (
    <div className="mx-auto max-w-2xl px-margin-mobile md:px-margin-desktop py-xl">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 rounded-full bg-primary-fixed grid place-items-center mb-sm">
            <GraduationCap className="w-8 h-8 text-on-primary-fixed" />
          </div>
          <CardTitle>Teach with the Academy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-md">
          <p className="text-body-md text-on-surface-variant">
            We're building tools for scholars and instructors to share their knowledge with students
            worldwide. Teacher applications open next sprint.
          </p>
          <Link to="/">
            <Button>Back to home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
