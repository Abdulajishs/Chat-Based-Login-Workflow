"use client";

import { ChatContainer } from "../components/chat/ChatContainer";
import { useWorkflowMachine } from "../hooks/useWorkflowMachine";

export default function ChatPage() {
  const workflow = useWorkflowMachine();
  return <ChatContainer {...workflow} />;
}
