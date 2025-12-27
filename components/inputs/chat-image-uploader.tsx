import { useState } from "react";
import { Upload } from "lucide-react";
import UploadModal from "@/components/inputs/upload-modal";

interface ChatImageUploaderProps {
    onSubmit: (input: string | File) => void;
}

export default function ChatImageUploader({ onSubmit }: ChatImageUploaderProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleUploadComplete = (files: File[]) => {
        if (files.length > 0) {
            const latestFile = files[files.length - 1];
            onSubmit(latestFile);
            setIsModalOpen(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-full p-4 border-2 border-dashed border-blue-400 bg-blue-50/50 hover:bg-blue-50 text-blue-600 rounded-xl flex flex-col items-center justify-center gap-2 transition-all group"
            >
                <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    <Upload size={24} className="text-blue-500" />
                </div>
                <span className="font-semibold">Tap to Upload</span>
                <span className="text-xs text-blue-400">Scan or select from gallery</span>
            </button>

            <UploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUploadComplete={handleUploadComplete}
            />
        </>
    );
}