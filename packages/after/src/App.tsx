import React from "react";
import { Header } from "./components/organisms";
import { ManagementPage } from "./pages/ManagementPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* shadcn/ui 컴포넌트 테스트 */}
      <div className="p-8 space-y-6 bg-background">
        <Card>
          <CardHeader>
            <CardTitle>✨ shadcn/ui 컴포넌트 테스트</CardTitle>
            <CardDescription>
              TailwindCSS + CVA + Radix UI 기반 컴포넌트 시스템
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Button Variants</h3>
              <div className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Button Sizes</h3>
              <div className="flex items-center gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Badges</h3>
              <div className="flex gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Header />
      <main>
        <ManagementPage />
      </main>
    </div>
  );
};
