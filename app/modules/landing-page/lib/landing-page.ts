import { count, countDistinct, desc, eq, inArray } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "~/db/schema";
import {
  CourseStatus,
  categories,
  courses,
  lessons,
  modules,
  users,
} from "~/db/schema";

export type Db = BetterSQLite3Database<typeof schema>;

const FEATURED_COURSE_LIMIT = 3;

export type FeaturedCourse = {
  id: number;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string | null;
  instructorName: string;
  lessonCount: number;
};

export type LandingStats = {
  courses: number;
  lessons: number;
  instructors: number;
  categories: number;
};

export type LandingPage = {
  featuredCourses: FeaturedCourse[];
  stats: LandingStats;
};

const isPublished = eq(courses.status, CourseStatus.Published);

function getNewestPublishedCourses(db: Db) {
  return db
    .select({
      id: courses.id,
      title: courses.title,
      slug: courses.slug,
      description: courses.description,
      coverImageUrl: courses.coverImageUrl,
      instructorName: users.name,
    })
    .from(courses)
    .innerJoin(users, eq(courses.instructorId, users.id))
    .where(isPublished)
    .orderBy(desc(courses.createdAt), desc(courses.id))
    .limit(FEATURED_COURSE_LIMIT)
    .all();
}

function getLessonCounts(db: Db, courseIds: number[]) {
  const rows = db
    .select({ courseId: modules.courseId, lessonCount: count(lessons.id) })
    .from(modules)
    .innerJoin(lessons, eq(lessons.moduleId, modules.id))
    .where(inArray(modules.courseId, courseIds))
    .groupBy(modules.courseId)
    .all();
  return new Map(rows.map((row) => [row.courseId, row.lessonCount]));
}

function getFeaturedCourses(db: Db): FeaturedCourse[] {
  const newest = getNewestPublishedCourses(db);
  const lessonCounts = getLessonCounts(
    db,
    newest.map((course) => course.id)
  );
  return newest.map((course) => ({
    ...course,
    lessonCount: lessonCounts.get(course.id) ?? 0,
  }));
}

function getCatalogueTotals(db: Db) {
  const totals = db
    .select({
      courses: countDistinct(courses.id),
      instructors: countDistinct(courses.instructorId),
    })
    .from(courses)
    .where(isPublished)
    .get();
  return {
    courses: totals?.courses ?? 0,
    instructors: totals?.instructors ?? 0,
  };
}

function countPublishedLessons(db: Db) {
  const row = db
    .select({ lessons: count(lessons.id) })
    .from(lessons)
    .innerJoin(modules, eq(lessons.moduleId, modules.id))
    .innerJoin(courses, eq(modules.courseId, courses.id))
    .where(isPublished)
    .get();
  return row?.lessons ?? 0;
}

function countCategories(db: Db) {
  const row = db.select({ categories: count() }).from(categories).get();
  return row?.categories ?? 0;
}

export function getLandingPage(db: Db): LandingPage {
  return {
    featuredCourses: getFeaturedCourses(db),
    stats: {
      ...getCatalogueTotals(db),
      lessons: countPublishedLessons(db),
      categories: countCategories(db),
    },
  };
}
