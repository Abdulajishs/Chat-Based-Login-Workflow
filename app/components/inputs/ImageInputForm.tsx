
interface ImageInputFormProps {
    onSubmit: (input: string | File) => void;
}

export default function ImageInputForm({ onSubmit }: ImageInputFormProps) {
    return (
        <input
            type="file"
            accept="image/*"
            className="p-3 border rounded bg-gray-600 text-white w-full"
            onChange={(e) => {
                const input = e.target;
                const file = input.files?.[0];
                console.log(file)
                if (file) onSubmit(file);
                input.value = "";
            }}
        />
    )
}