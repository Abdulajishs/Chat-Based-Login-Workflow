import { ChatInputProps } from "@/components/chat/chat-input"
import { WorkflowStates } from "@/types/auth";

export default function MessageInput({ state, onSubmit }: ChatInputProps) {
    return (
        <form
            className="p-3 border-t flex gap-2 h-[70px]"
            onSubmit={(e) => {
                e.preventDefault();
                const value = e.currentTarget.input.value;
                if (!value) return;
                onSubmit(value);
                e.currentTarget.reset();
            }}
        >
            <input
                name="input"
                type="text"
                inputMode={
                    state === WorkflowStates.ENTERING_PHONE
                        ? "numeric"
                        : "text"
                }
                pattern={
                    state === WorkflowStates.ENTERING_PHONE
                        ? "[0-9]{10}"
                        : state === WorkflowStates.WAITING_FOR_OTP
                            ? "[0-9]{6}"
                            : undefined
                }
                maxLength={
                    state === WorkflowStates.ENTERING_PHONE
                        ? 10
                        : state === WorkflowStates.WAITING_FOR_OTP
                            ? 6
                            : undefined
                }
                className="flex-1 border rounded px-2 bg-gray-600"
                placeholder="Type here..."
                onChange={(e) => {
                    if (
                        state === WorkflowStates.ENTERING_PHONE ||
                        state === WorkflowStates.WAITING_FOR_OTP
                    ) {
                        e.target.value = e.target.value.replace(/\D/g, "");
                    }
                }}
            />

            <button className="bg-blue-600 text-white px-4 rounded">
                Send
            </button>
        </form>
    )
}