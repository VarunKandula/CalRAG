import { Course } from "../types/course";
import { findCourses, findSimilarCourseVectors } from "./mongodb";
import { getEmbedding } from "./openai";

export async function getCourseById(courseId: string): Promise<Course | null> {
  const courses = await findCourses({ courseId });
  return courses[0] || null;
}

export async function findSimilarCourses(
  query: string,
  limit: number = 3
): Promise<Course[]> {
  // Generate embedding for the query
  const queryEmbedding = await getEmbedding(query);

  // Find similar course vectors using vector similarity
  const similarVectors = await findSimilarCourseVectors(queryEmbedding, limit);

  // Get the corresponding courses
  const courseIds = similarVectors.map((vector) => vector.courseId);
  const courses = await findCourses({ courseId: { $in: courseIds } });

  // Sort courses to match the order of similarity
  return courseIds.map((id) => courses.find((course) => course.courseId === id)!);
}

export function formatCourseInfo(course: Course): string {
  return `Course: ${course.courseId} - ${course.name}
Description: ${course.description}
Department: ${course.department}
Credits: ${course.credits}
Prerequisites: ${course.prerequisites.join(", ") || "None"}
Topics: ${course.topics.join(", ")}
Schedule: ${course.schedule.term}
${course.schedule.lectures
  .map(
    (lecture) =>
      `  ${lecture.day} at ${lecture.time} in ${lecture.location}`
  )
  .join("\n")}`;
}
