import { BookOpen, GraduationCap, PlayCircle, Users } from "lucide-react";
import type { LandingStats as Stats } from "~/modules/landing-page/index.server";

export function LandingStats({ stats }: { stats: Stats }) {
  const items = [
    { icon: BookOpen, value: stats.courses, label: "Published courses" },
    { icon: PlayCircle, value: stats.lessons, label: "Lessons" },
    { icon: Users, value: stats.instructors, label: "Instructors" },
    { icon: GraduationCap, value: stats.categories, label: "Categories" },
  ];

  return (
    <section className="border-y border-border bg-muted/50 py-12">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 lg:grid-cols-4">
        {items.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="size-6 text-primary" />
            </span>
            <div>
              <dd className="text-2xl font-bold">{value}</dd>
              <dt className="text-sm text-muted-foreground">{label}</dt>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
