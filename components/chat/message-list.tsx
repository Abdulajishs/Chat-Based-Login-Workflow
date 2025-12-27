import { ChatMessage } from "@/types/auth";
import { useEffect, useRef } from "react";
import { WorkflowState } from "@/types/auth";
import ChatImageUploader from "@/components/inputs/chat-image-uploader";
import VehicleSelection from "@/components/inputs/vehicle-selection";

interface MessageListProps {
  messages: ChatMessage[];
  state: WorkflowState;
  onInteract: (input: string | File) => void;
  vehicleData: { brand: string; model: string; variant: string };
  setVehicleData: (data: any) => void;
  setWorkflowState: (state: WorkflowState) => void;
}

export function MessageList({
  messages,
  state,
  onInteract,
  vehicleData,
  setVehicleData,
  setWorkflowState,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, state]);

  const renderActiveInput = () => {
    if (state === "sendingOtp" || state === "validatingOtp") {
      return (
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          <span>{state === "sendingOtp" ? "Sending OTP..." : "Validating OTP..."}</span>
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
      {messages.map((message, index) => {
        // VEHICLE SELECTION SYSTEM MESSAGE
        if (message.type === "VEHICLE_SELECTION") {
          return (
            <VehicleSelection
              key={`vehicle-${index}`}
              state={state}
              vehicleData={vehicleData}
              setVehicleData={setVehicleData}
              setWorkflowState={setWorkflowState}
              onInteract={(val) => onInteract(val)}
            />
          );
        }

        // NORMAL TEXT MESSAGE
        return (
          <div
            key={`${message.from}-${index}`}
            className={`p-2 rounded max-w-[80%] ${message.from === "system"
              ? message.isError
                ? "bg-red-100 text-red-600"
                : "bg-gray-200 text-black"
              : "bg-blue-600 text-white ml-auto"
              }`}
          >
            {message.text}
          </div>
        );
      })}

      {renderActiveInput()}
      <div ref={bottomRef} />
    </div>
  );
}
