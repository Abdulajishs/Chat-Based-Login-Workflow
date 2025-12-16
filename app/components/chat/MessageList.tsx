import { ChatMessage } from "@/app/hooks/useWorkflowMachine";
import { useEffect, useRef } from "react";

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(()=>{
    bottomRef.current?.scrollIntoView({behavior: 'smooth'})
  },[messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((message,index) => (
        <div
          key={`${message.from}-${index}`}
          className={`p-2 rounded max-w-[80%] ${
            message.from === "system"
              ? "bg-gray-200 text-black"
              : "bg-blue-600 text-white ml-auto"
          }`}
        >
          {message.text}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
