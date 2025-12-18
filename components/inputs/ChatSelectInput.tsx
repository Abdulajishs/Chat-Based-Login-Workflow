
interface ChatSelectInputProps {
    options: string[];
    onSelect: (value: string) => void;
}


export default function ChatSelectInput({ options, onSelect }: ChatSelectInputProps) {
    return (
        <select
            className="p-3 border rounded bg-gray-600 text-white w-full"
            defaultValue=""
            onChange={(e) => {
                const value = e.target.value;
                console.log(value, "value")
                if (value) onSelect(value);
            }}
        >
            <option value="" disabled>
                Select an option
            </option>

            {options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    );
}
