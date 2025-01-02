export interface Lecture {
  day: string;
  time: string;
  location: string;
}

export interface Schedule {
  term: string;
  lectures: Lecture[];
}

export interface Course {
  courseId: string;
  name: string;
  description: string;
  department: string;
  section: string;
  schedule: Schedule;
  topics: string[];
  prerequisites?: string[];
  credits: number;
  embedding?: number[];
}

export interface CourseVector {
  courseId: string;
  embedding: number[];
}
