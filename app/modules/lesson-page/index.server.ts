import { loadLessonPage as load } from "./lib/load.server";
import { runLessonAction as act } from "./lib/act.server";

export type LessonPage = Awaited<ReturnType<typeof load>>;

/**
 * Everything the lesson page shows, or a 404 thrown as a response. A person
 * who cannot view the content gets the locked shape: title and outline only.
 */
export function loadLessonPage(
  request: Request,
  params: { slug: string; lessonId: string }
): Promise<LessonPage> {
  return load(request, params);
}

/**
 * Runs one form intent from the lesson page (comments, Bookmark, Note,
 * progress, quiz). Each intent checks its own capability.
 */
export function runLessonAction(
  request: Request,
  params: { slug: string; lessonId: string }
) {
  return act(request, params);
}
