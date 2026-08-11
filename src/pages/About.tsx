import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>About Lovable</CardTitle>
            <CardDescription>Our mission is to make product development delightful.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Lovable was created to remove friction between ideas and production. We combine an
              intuitive developer experience with powerful collaboration features so teams can focus on
              building great user experiences.
            </p>

            <h3 className="text-lg font-semibold mt-4">Our values</h3>
            <ul className="list-disc ml-6 mt-2 space-y-2 text-sm text-muted-foreground">
              <li>Developer empathy — delightful tools that reduce cognitive load.</li>
              <li>Collaboration — context-rich communication across teams.</li>
              <li>Reliability — production-ready defaults so releases are predictable.</li>
            </ul>

            <div className="mt-6 flex gap-3">
              <Link to="/services"><Button>See services</Button></Link>
              <Link to="/signup"><Button variant="outline">Create account</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
