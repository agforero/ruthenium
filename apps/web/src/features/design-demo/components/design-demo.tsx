import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as Separator from "@radix-ui/react-separator";
import { Sparkles, Workflow } from "lucide-react";

export function DesignDemo() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="secondary">shadcn/ui</Badge>
          <Badge variant="outline">Radix UI</Badge>
        </div>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          New UI Foundation
        </CardTitle>
        <CardDescription>
          This panel is a small demo using shadcn-style components and a Radix
          primitive so you can see the visual direction before we migrate the
          whole screen.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Button className="w-full justify-center gap-2">
            <Workflow className="h-4 w-4" />
            Generate dependency view
          </Button>
          <Button className="w-full" variant="outline">
            Open selected project
          </Button>
        </div>
        <Separator.Root className="h-px w-full bg-border" decorative />
        <p className="text-sm text-muted-foreground">
          Next step: wire React Flow into this design system and replace the
          remaining inline styles in feature panels.
        </p>
      </CardContent>
    </Card>
  );
}
