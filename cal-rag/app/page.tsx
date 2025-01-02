"use client";

import { useChat } from "ai/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col w-full max-w-xl py-24 mx-auto stretch">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Course Assistant</h1>
        <p className="text-gray-600">
          Ask me about courses! For example:
        </p>
        <div className="mt-2 text-sm text-gray-500">
          <p>"Find me courses about machine learning"</p>
          <p>"What prerequisites do I need for CS301?"</p>
          <p>"Show me courses that teach Python programming"</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 pb-24">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-[85%] ${
                m.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-xl p-4 mb-8 bg-white border border-gray-300 rounded-t-xl"
      >
        <input
          className="w-full p-2 border border-gray-300 rounded"
          value={input}
          placeholder="Ask about courses..."
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-900"
        >
          Send
        </button>
      </form>
    </div>
  );
}
