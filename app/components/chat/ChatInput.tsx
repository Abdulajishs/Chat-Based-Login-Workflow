import { WorkflowState } from "@/app/types/auth";
import MessageInput from "../inputs/MessageInput";

export interface ChatInputProps {
  state: WorkflowState;
  onSubmit: (input: string | File) => void;
}

export function ChatInput({ state, onSubmit }: ChatInputProps) {
  return <MessageInput state={state} onSubmit={onSubmit} />;
}
