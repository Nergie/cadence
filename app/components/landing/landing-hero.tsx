import { Link } from "react-router";
import {
  ArrowRight,
  BadgeCheck,
  ChartNoAxesColumn,
  Globe,
  ListChecks,
  Layers,
} from "lucide-react";
import { Button } from "~/components/ui/button";

const HIGHLIGHTS = [
  {
    icon: Layers,
    title: "Structured modules",
    body: "Every course is broken into short modules and lessons, in order.",
  },
  {
    icon: ListChecks,
    title: "Quizzes that check you",
    body: "Test what you learned before you move on to the next module.",
  },
  {
    icon: ChartNoAxesColumn,
    title: "Progress you can see",
    body: "Pick up exactly where you left off, on any device.",
  },
  {
    icon: Globe,
    title: "Fair pricing",
    body: "Prices adjust to where you live, so more people can learn.",
  },
];

export function LandingHero({ signedIn }: { signedIn: boolean }) {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.15fr_1fr] lg:py-28">
      <div>
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
          <BadgeCheck className="size-3.5 text-primary" />
          Courses for developers, by developers
        </p>
        <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl">
          Learn to code,
          <br />
          <span className="text-muted-foreground">at your own pace</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          Structured courses built by experienced instructors. Track your
          progress, take quizzes, and build real-world skills.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button asChild size="lg">
            <Link to="/courses">
              Browse Courses
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          {signedIn ? (
            <Button asChild size="lg" variant="outline">
              <Link to="/dashboard">Go to your dashboard</Link>
            </Button>
          ) : (
            <Button asChild size="lg" variant="outline">
              <Link to="/signup">Create a free account</Link>
            </Button>
          )}
        </div>
      </div>
      <HighlightList />
    </section>
  );
}

function HighlightList() {
  return (
    <ul className="grid gap-4 rounded-2xl border border-border bg-muted/40 p-6 sm:grid-cols-2 lg:grid-cols-1">
      {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
        <li
          key={title}
          className="flex items-start gap-4 rounded-xl bg-background p-4 shadow-sm"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-5 text-primary" />
          </span>
          <span>
            <span className="block font-semibold">{title}</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              {body}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
