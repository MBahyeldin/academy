import { Link, useParams } from "react-router-dom";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@academy/ui";
import { Construction } from "lucide-react";

export function EnrollStubPage() {
  const { courseId } = useParams();
  return (
    <div className="mx-auto max-w-2xl px-margin-mobile md:px-margin-desktop py-xl">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 rounded-full bg-secondary-fixed grid place-items-center mb-sm">
            <Construction className="w-8 h-8 text-on-secondary-fixed" />
          </div>
          <CardTitle>Enrollment launching soon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-md">
          <p className="text-body-md text-on-surface-variant">
            We're putting the finishing touches on our enrollment flow. Course #{courseId} will be
            available to enroll in shortly.
          </p>
          <p className="text-body-md text-on-surface-variant">
            In the meantime, you can continue browsing or sign up for an account to be notified.
          </p>
          <div className="flex gap-xs justify-center pt-xs">
            <Link to="/courses">
              <Button variant="outline">Back to courses</Button>
            </Link>
            <Link to="/login">
              <Button>Create account</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
