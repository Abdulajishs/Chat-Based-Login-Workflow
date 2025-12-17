import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

export function ChatContainer({
  state,
  messages,
  sendUserMessage,
}: any) {
  return (
    <div className="h-screen flex justify-center bg-gray-600">
      <div className="flex flex-col w-full max-w-md bg-black shadow">
        <MessageList
          messages={messages}
          state={state}
          onInteract={sendUserMessage}
        />
        <ChatInput state={state} onSubmit={sendUserMessage} />
      </div>
    </div>
  );
}
