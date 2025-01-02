import { NextRequest, NextResponse } from "next/server";
import { generateResponse } from "../../../lib/rag-service";

// Set the runtime to nodejs for best performance
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Get the latest message
    const latestMessage = messages[messages.length - 1].content;

    // Generate RAG-enhanced response
    const response = await generateResponse(messages, latestMessage);

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("Error in chat route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
