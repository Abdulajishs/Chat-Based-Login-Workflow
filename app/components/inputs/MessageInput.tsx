import { ChatInputProps } from "../chat/ChatInput"

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
                    state === "enteringPhone" || state === "waitingForOtp"
                        ? "numeric"
                        : "text"
                }
                pattern={
                    state === "enteringPhone"
                        ? "[0-9]{10}"
                        : state === "waitingForOtp"
                            ? "[0-9]{6}"
                            : undefined
                }
                maxLength={
                    state === "enteringPhone"
                        ? 10
                        : state === "waitingForOtp"
                            ? 6
                            : undefined
                }
                className="flex-1 border rounded px-2 bg-gray-600"
                placeholder="Type here..."
                onChange={(e) => {
                    if (
                        state === "enteringPhone" ||
                        state === "waitingForOtp"
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