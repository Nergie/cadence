import { describe, it, expect, beforeEach } from "vitest";
import { createTestDb, seedBaseData, type TestDb } from "~/test/setup";
import * as schema from "~/db/schema";
import { CourseStatus, UserRole } from "~/db/schema";
import { markdown } from "~/lib/text";
import { createLandingPage, FEATURED_COURSE_LIMIT } from "../index.server";

let db: TestDb;
let base: ReturnType<typeof seedBaseData>;

beforeEach(() => {
  db = createTestDb();
  base = seedBaseData(db);
});

function load() {
  return createLandingPage(db).get();
}

// ─── Fixtures ───
// No module writes courses or lessons yet, so rows go in directly. Kept in
// one place so a schema change touches only this block.

let slugCounter = 0;

function addInstructor(name: string) {
  return db
    .insert(schema.users)
    .values({
      name,
      email: `${name.toLowerCase().replaceAll(" ", ".")}@example.com`,
      role: UserRole.Instructor,
    })
    .returning()
    .get();
}

function addCategory(name: string) {
  return db
    .insert(schema.categories)
    .values({ name, slug: name.toLowerCase() })
    .returning()
    .get();
}

function addCourse(
  title: string,
  {
    status = CourseStatus.Published,
    instructorId = base.instructor.id,
    createdAt = "2026-01-01T00:00:00.000Z",
  } = {}
) {
  slugCounter += 1;
  return db
    .insert(schema.courses)
    .values({
      title,
      slug: `course-${slugCounter}`,
      description: `About ${title}`,
      salesCopy: markdown(title),
      instructorId,
      categoryId: base.category.id,
      status,
      createdAt,
    })
    .returning()
    .get();
}

function addLessons(courseId: number, count: number, moduleCount = 1) {
  for (let m = 0; m < moduleCount; m += 1) {
    const mod = db
      .insert(schema.modules)
      .values({ courseId, title: `Module ${m}`, position: m })
      .returning()
      .get();
    for (let l = 0; l < count; l += 1) {
      db.insert(schema.lessons)
        .values({ moduleId: mod.id, title: `Lesson ${l}`, position: l })
        .run();
    }
  }
}

// ─── Featured courses ───

describe("featured courses", () => {
  it("lists the newest published courses first, at most three", () => {
    addCourse("Middle", { createdAt: "2999-03-01T00:00:00.000Z" });
    addCourse("Newest", { createdAt: "2999-05-01T00:00:00.000Z" });
    addCourse("Newer", { createdAt: "2999-04-01T00:00:00.000Z" });

    const titles = load().featuredCourses.map((c) => c.title);

    expect(FEATURED_COURSE_LIMIT).toBe(3);
    expect(titles).toEqual(["Newest", "Newer", "Middle"]);
  });

  it("leaves out drafts and archived courses", () => {
    addCourse("Draft", {
      status: CourseStatus.Draft,
      createdAt: "2999-09-01T00:00:00.000Z",
    });
    addCourse("Archived", {
      status: CourseStatus.Archived,
      createdAt: "2999-09-02T00:00:00.000Z",
    });

    const titles = load().featuredCourses.map((c) => c.title);

    expect(titles).toEqual([base.course.title]);
  });

  it("carries what a course card shows, with the instructor's name", () => {
    const [card] = load().featuredCourses;

    expect(card).toEqual({
      id: base.course.id,
      title: "Test Course",
      slug: "test-course",
      description: "A test course",
      coverImageUrl: null,
      instructorName: "Test Instructor",
      lessonCount: 0,
    });
  });

  it("counts every lesson across a course's modules", () => {
    addLessons(base.course.id, 4, 2);
    const other = addCourse("Other", {
      createdAt: "2025-01-01T00:00:00.000Z",
    });
    addLessons(other.id, 3);

    const counts = Object.fromEntries(
      load().featuredCourses.map((c) => [c.title, c.lessonCount])
    );

    expect(counts).toEqual({ "Test Course": 8, Other: 3 });
  });

  it("is empty when nothing is published", () => {
    db.update(schema.courses).set({ status: CourseStatus.Draft }).run();

    expect(load().featuredCourses).toEqual([]);
  });
});

// ─── Stats ───

describe("stats", () => {
  it("counts published courses, their lessons and their instructors", () => {
    const second = addInstructor("Second Teacher");
    const third = addInstructor("Third Teacher");
    addLessons(base.course.id, 2);
    const another = addCourse("Another", { instructorId: second.id });
    addLessons(another.id, 3);
    addCourse("Same instructor again");
    const draft = addCourse("Draft", {
      status: CourseStatus.Draft,
      instructorId: third.id,
    });
    addLessons(draft.id, 10);

    expect(load().stats).toEqual({
      courses: 3,
      lessons: 5,
      instructors: 2,
      categories: 1,
    });
  });

  it("counts more courses than the page features", () => {
    for (let i = 0; i < 60; i += 1) addCourse(`Course ${i}`);

    const page = load();

    expect(page.stats.courses).toBe(61);
    expect(page.featuredCourses).toHaveLength(FEATURED_COURSE_LIMIT);
  });

  it("counts every category", () => {
    addCategory("Design");
    addCategory("Data");

    expect(load().stats.categories).toBe(3);
  });

  it("is all zeros on an empty catalogue", () => {
    const empty = createLandingPage(createTestDb()).get();

    expect(empty).toEqual({
      featuredCourses: [],
      stats: { courses: 0, lessons: 0, instructors: 0, categories: 0 },
    });
  });
});
