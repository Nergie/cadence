import type { LessonPage } from "./index.server";

export type LockedLessonPage = Extract<LessonPage, { view: "locked" }>;
export type FullLessonPage = Extract<LessonPage, { view: "full" }>;
