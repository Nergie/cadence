import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "~/components/ui/card";

/**
 * The frame shared by the panels under a lesson (notes, discussion), so they
 * read as one set rather than as boxes from different pages.
 */
export function LessonPanel({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className="mb-8 gap-4 px-6">
      <div>
        <div className="flex items-center gap-2">
          <Icon className="size-5 text-primary" />
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </Card>
  );
}
