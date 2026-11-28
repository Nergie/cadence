import { useState } from "react";
import { useFetcher } from "react-router";
import { NotebookPen } from "lucide-react";
import { LessonPanel } from "~/components/lesson-panel";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { cn, formatRelativeTime } from "~/lib/utils";
import { type NoteDraftStatus, noteDraftStatus } from "~/modules/lesson-note";

type SavedNote = { body: string; updatedAt: string };

export function LessonNote({ note }: { note: SavedNote | null }) {
  const fetcher = useFetcher<{ ok: boolean; error?: string }>();
  const [draft, setDraft] = useState(note?.body ?? "");
  const isSaving = fetcher.state !== "idle";
  const status = noteDraftStatus(draft, note?.body ?? "");

  return (
    <LessonPanel
      icon={NotebookPen}
      title="Your notes"
      description="Private to you. Jot things down while you watch."
    >
      <fetcher.Form method="post" className="space-y-2">
        <input type="hidden" name="intent" value="save-note" />
        <Textarea
          name="body"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="What stood out in this lesson?"
          aria-label="Your notes"
          className="min-h-28 resize-y"
        />
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            size="sm"
            disabled={isSaving || !status.canSave}
          >
            {isSaving ? "Saving..." : note ? "Save changes" : "Save note"}
          </Button>
          <NoteStatus note={note} status={status} error={fetcher.data?.error} />
        </div>
      </fetcher.Form>
    </LessonPanel>
  );
}

function NoteStatus({
  note,
  status,
  error,
}: {
  note: SavedNote | null;
  status: NoteDraftStatus;
  error: string | undefined;
}) {
  return (
    <>
      {error ? (
        <span className="text-sm text-destructive">{error}</span>
      ) : (
        note && (
          <span
            suppressHydrationWarning
            className="text-xs text-muted-foreground"
          >
            {status.unchanged ? "Saved" : "Unsaved changes"} · last edited{" "}
            {formatRelativeTime(note.updatedAt)}
          </span>
        )
      )}
      <span
        className={cn(
          "ml-auto text-xs",
          status.tooLong ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {status.counter}
      </span>
    </>
  );
}
