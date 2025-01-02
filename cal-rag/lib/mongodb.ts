import { MongoClient, ServerApiVersion } from "mongodb";
import { Course, CourseVector } from "../types/course";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 1,
  minPoolSize: 0,
  maxIdleTimeMS: 10000,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  },
};

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function findCourses(filter: any): Promise<Course[]> {
  const client = await clientPromise;
  const db = client.db("classes");
  const results = await db.collection<Course>("courses").find(filter).toArray();
  return results as Course[];
}

export async function findSimilarCourseVectors(
  embedding: number[],
  limit: number
): Promise<CourseVector[]> {
  const client = await clientPromise;
  const db = client.db("classes");

  const results = await db
    .collection<CourseVector>("course_vectors")
    .aggregate([
      {
        $search: {
          knnBeta: {
            vector: embedding,
            path: "embedding",
            k: limit,
          },
        },
      },
    ])
    .toArray();

  return results.map((doc) => ({
    courseId: doc.courseId,
    embedding: doc.embedding,
  })) as CourseVector[];
}

export async function createCollection(name: string) {
  const client = await clientPromise;
  const db = client.db("classes");
  return db.createCollection(name);
}

export async function createIndex(collection: string, index: any) {
  const client = await clientPromise;
  const db = client.db("classes");
  return db.collection(collection).createIndex(index);
}

export async function updateOne(
  collection: string,
  filter: any,
  update: any,
  options: any = {}
) {
  const client = await clientPromise;
  const db = client.db("classes");
  return db.collection(collection).updateOne(filter, update, options);
}

export default clientPromise;
