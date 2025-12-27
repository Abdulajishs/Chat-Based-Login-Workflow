import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";
import UserActivity from "@/components/chat/user-activity";

export function ChatContainer({
  state,
  messages,
  sendUserMessage,
  vehicleData,
  setVehicleData,
  setWorkflowState,
}: any) {
  return (
    <div className="h-screen flex justify-center bg-gray-600">
      <div className="relative flex flex-col w-full max-w-md bg-black shadow">
        <MessageList
          messages={messages}
          state={state}
          onInteract={sendUserMessage}
          vehicleData={vehicleData}
          setVehicleData={setVehicleData}
          setWorkflowState={setWorkflowState}
        />
        <ChatInput state={state} onSubmit={sendUserMessage} />
        <UserActivity />
      </div>
    </div>
  );
}
