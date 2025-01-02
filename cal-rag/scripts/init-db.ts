require("dotenv").config({ path: ".env.local" });

import { Course } from "../types/course";
import { getEmbedding } from "../lib/openai";
import clientPromise from "../lib/mongodb";

const sampleCourses: Omit<Course, "embedding">[] = [
  {
    courseId: "CS101",
    name: "Introduction to Computer Science",
    description:
      "A comprehensive introduction to computer science fundamentals including programming basics, algorithms, and problem-solving using Python. Topics cover basic syntax, data structures, and object-oriented programming concepts.",
    department: "Computer Science",
    section: "001",
    schedule: {
      term: "Spring 2024",
      lectures: [
        {
          day: "Monday",
          time: "10:00 AM - 11:20 AM",
          location: "Tech Building 101",
        },
        {
          day: "Wednesday",
          time: "10:00 AM - 11:20 AM",
          location: "Tech Building 101",
        },
      ],
    },
    topics: [
      "Python Programming",
      "Basic Algorithms",
      "Data Structures",
      "Object-Oriented Programming",
      "Problem Solving",
    ],
    prerequisites: [],
    credits: 3,
  },
  {
    courseId: "CS201",
    name: "Data Structures and Algorithms",
    description:
      "Advanced study of data structures and algorithms. Covers implementation and applications of trees, graphs, hash tables, and advanced sorting algorithms. Includes analysis of algorithm efficiency and complexity.",
    department: "Computer Science",
    section: "001",
    schedule: {
      term: "Spring 2024",
      lectures: [
        {
          day: "Tuesday",
          time: "2:00 PM - 3:20 PM",
          location: "Tech Building 203",
        },
        {
          day: "Thursday",
          time: "2:00 PM - 3:20 PM",
          location: "Tech Building 203",
        },
      ],
    },
    topics: [
      "Advanced Data Structures",
      "Graph Algorithms",
      "Sorting Algorithms",
      "Algorithm Analysis",
      "Time Complexity",
    ],
    prerequisites: ["CS101"],
    credits: 3,
  },
  {
    courseId: "CS301",
    name: "Machine Learning Fundamentals",
    description:
      "Introduction to machine learning concepts and applications. Covers supervised and unsupervised learning, neural networks, and practical implementation using Python libraries like TensorFlow and scikit-learn.",
    department: "Computer Science",
    section: "001",
    schedule: {
      term: "Spring 2024",
      lectures: [
        { day: "Monday", time: "3:30 PM - 4:50 PM", location: "AI Lab 105" },
        { day: "Wednesday", time: "3:30 PM - 4:50 PM", location: "AI Lab 105" },
      ],
    },
    topics: [
      "Supervised Learning",
      "Neural Networks",
      "Deep Learning",
      "TensorFlow",
      "Model Evaluation",
    ],
    prerequisites: ["CS201"],
    credits: 3,
  },
];

async function initializeDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db("classes");

    // Create collections
    await db.createCollection("courses");
    await db.createCollection("course_vectors");

    // Create indexes
    await db.collection("courses").createIndex({ courseId: 1 }, { unique: true });
    await db.collection("course_vectors").createIndex({ courseId: 1 }, { unique: true });

    // Insert courses and their embeddings
    for (const course of sampleCourses) {
      // Generate embedding from course description and topics
      const embeddingText = `${course.name} ${
        course.description
      } ${course.topics.join(" ")}`;
      const embedding = await getEmbedding(embeddingText);

      // Insert course
      await db.collection("courses").updateOne(
        { courseId: course.courseId },
        { $set: course },
        { upsert: true }
      );

      // Insert vector
      await db.collection("course_vectors").updateOne(
        { courseId: course.courseId },
        {
          $set: {
            courseId: course.courseId,
            embedding: embedding,
          },
        },
        { upsert: true }
      );
    }

    console.log("Database initialized successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

initializeDatabase();
