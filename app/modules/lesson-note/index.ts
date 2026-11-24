import { MAX_NOTE_LENGTH } from "~/lib/notes";
import { describeDraft, type NoteDraftStatus } from "./lib/draft";

export type { NoteDraftStatus };

/**
 * What the note editor shows for a draft: the character counter, whether it
 * is over the limit, and whether Save does anything. `savedBody` is the note
 * as stored, or "" when the Student has not written one.
 */
export function noteDraftStatus(
  draft: string,
  savedBody: string,
  maxLength: number = MAX_NOTE_LENGTH
): NoteDraftStatus {
  return describeDraft(draft, savedBody, maxLength);
}
