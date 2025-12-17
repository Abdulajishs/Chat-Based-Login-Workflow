import { ChatMessage } from "@/app/hooks/useWorkflowMachine";
import { useEffect, useRef } from "react";
import { WorkflowState } from "@/app/types/auth";
import { VEHICLE_OPTIONS } from "@/app/types/vehicles";
import ChatSelectInput from "../inputs/ChatSelectInput";
import ChatImageUploader from "../inputs/ChatImageUploader";

interface MessageListProps {
  messages: ChatMessage[];
  state: WorkflowState;
  onInteract: (input: string | File) => void;
}

export function MessageList({ messages, state, onInteract }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, state]);

  const renderActiveInput = () => {
    if (
      state === "vehiclebrandselection" ||
      state === "vehiclemodelselection" ||
      state === "vehiclevariantselection"
    ) {
      return (
        <div className="mt-2 text-black">
          <ChatSelectInput
            key={state}
            options={VEHICLE_OPTIONS[state]}
            onSelect={(value) => onInteract(value)}
          />
        </div>
      );
    }

    if (state === "uploadpan" || state === "uploadesign") {
      return (
        <div className="mt-2">
          <ChatImageUploader onSubmit={onInteract} />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 text-black">
      {messages.map((message, index) => (
        <div
          key={`${message.from}-${index}`}
          className={`p-2 rounded max-w-[80%] ${message.from === "system"
              ? "bg-gray-200 text-black"
              : "bg-blue-600 text-white ml-auto"
            }`}
        >
          {message.text}
        </div>
      ))}
      {renderActiveInput()}
      <div ref={bottomRef} />
    </div>
  );
}
