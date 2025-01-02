import { findSimilarCourses, formatCourseInfo } from "./course-service";
import { openai } from "./openai";
import { ChatCompletionRequestMessage } from "openai-edge";

const SYSTEM_PROMPT = `You are a helpful academic advisor assistant. You help students find courses that match their interests and requirements. 
Use the course information provided to give detailed, relevant recommendations. The student might ask you about a course without the exact course name, adjust and search your knolwedge base accordingly. if there is no course that is even similar to the question, please respond with "I'm sorry, I don't have any recommendations for that."`;

export async function generateResponse(
  messages: ChatCompletionRequestMessage[],
  latestMessage: string
) {
  // Find relevant courses based on the latest message
  const relevantCourses = await findSimilarCourses(latestMessage);

  // Format course information
  const courseContext = relevantCourses
    .map((course) => formatCourseInfo(course))
    .join("\n\n");

  // Prepare messages for OpenAI
  const contextMessage: ChatCompletionRequestMessage = {
    role: "system",
    content: `${SYSTEM_PROMPT}\n\nHere are the most relevant courses:\n${courseContext}`,
  };

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [contextMessage, ...messages],
    temperature: 0.7,
    stream: false,
  });

  const result = await response.json();
  return result.choices[0].message.content;
}
