"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ThemeSelector } from "@/lib/theme/theme-selector";
import { useTheme } from "next-themes";

export default function ThemeDemoPage() {
  const { theme } = useTheme();

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 p-10 flex flex-col gap-10">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Theme Demo</h1>
        <ThemeSelector />
      </header>

      {/* Section 1: Buttons */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Buttons</h2>
        <div className="flex gap-4 flex-wrap">
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </section>

      {/* Section 2: Cards */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Cards</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <Card key={n}>
              <CardHeader>
                <CardTitle>Card {n}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This is a sample card to show how card backgrounds and text
                  colors look.
                </p>
                <Button className="mt-3 w-full">Action</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Section 3: Form Fields */}
      <section className="flex flex-col gap-4 max-w-md">
        <h2 className="text-xl font-semibold">Form Fields</h2>
        <div className="flex flex-col gap-3">
          <Input placeholder="Type something..." />
          <Input type="email" placeholder="Email address" />
          <Button className="w-full">Submit</Button>
        </div>
      </section>

      {/* Section 4: Status Colors */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Status Colors</h2>
        <div className="flex gap-4 flex-wrap">
          <div className="px-4 py-2 rounded-lg bg-success text-success-foreground">
            Success
          </div>
          <div className="px-4 py-2 rounded-lg bg-warning text-warning-foreground">
            Warning
          </div>
          <div className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground">
            Destructive
          </div>
          <div className="px-4 py-2 rounded-lg bg-accent text-accent-foreground">
            Accent
          </div>
        </div>
      </section>

      {/* Section 5: Sidebar Simulation */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Sidebar Preview</h2>
        <div className="flex border rounded-lg overflow-hidden">
          <aside className="w-60 bg-sidebar text-sidebar-foreground p-4 flex flex-col gap-3 border-r border-sidebar-border">
            <h3 className="font-semibold mb-2">Sidebar</h3>
            <Button className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              Primary Button
            </Button>
            <Button variant="outline" className="border-sidebar-border">
              Outline
            </Button>
          </aside>
          <div className="flex-1 p-6 bg-card text-card-foreground">
            <p>
              This section simulates content beside your sidebar. The background
              and border colors show how well your palette contrasts.
            </p>
          </div>
        </div>
      </section>

      <footer className="mt-10 text-sm text-muted-foreground text-center">
        Current theme: <strong>{theme}</strong>
      </footer>
    </main>
  );
}
