import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const services = [
  { title: "Managed Deployments", desc: "Preview and deploy with one click, built for teams." },
  { title: "Realtime Collaboration", desc: "Share workspaces and comments in context." },
  { title: "Secure Access", desc: "Role-based access control and audit logs." },
];

export default function Services() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Services</h1>
            <p className="text-sm text-muted-foreground">Professional services to accelerate your team.</p>
          </div>
          <div className="inline-flex items-center gap-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <Button>Contact sales</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <Card key={s.title}>
              <CardHeader>
                <CardTitle>{s.title}</CardTitle>
                <CardDescription>{s.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Custom onboarding and integrations to match your workflow.</p>
                <div className="mt-4">
                  <Button variant="outline">Learn more</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
