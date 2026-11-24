export type NoteDraftStatus = {
  length: number;
  tooLong: boolean;
  /** The draft matches what is already saved, so saving would do nothing. */
  unchanged: boolean;
  canSave: boolean;
  counter: string;
};

export function describeDraft(
  draft: string,
  savedBody: string,
  maxLength: number
): NoteDraftStatus {
  const length = draft.length;
  const tooLong = length > maxLength;
  const empty = draft.trim().length === 0;
  const unchanged = draft === savedBody;

  return {
    length,
    tooLong,
    unchanged,
    canSave: !empty && !tooLong && !unchanged,
    counter: `${length.toLocaleString("en")} / ${maxLength.toLocaleString("en")}`,
  };
}
