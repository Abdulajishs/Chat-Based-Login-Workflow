import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Upload, FileText, ArrowLeft, Check, Minus, Plus, Trash2 } from 'lucide-react';
import Cropper, { Area } from 'react-easy-crop';
import getCroppedImg from '@/utils/canvas-utils';
import { formatFileSize } from '@/utils/constants';

export interface UploadedFile {
    id: string;
    file: File;
    previewUrl: string;
    name: string;
    size: string;
}

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadComplete?: (files: File[]) => void;
    initialFiles?: UploadedFile[];
    title?: string;
}

export default function UploadModal({
    isOpen,
    onClose,
    onUploadComplete,
    initialFiles = [],
    title = "Uploaded Files"
}: UploadModalProps) {
    const [files, setFiles] = useState<UploadedFile[]>(initialFiles);

    const [selectedFileObj, setSelectedFileObj] = useState<{ file: File, preview: string } | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const cameraInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialFiles.length > 0) {
            setFiles(initialFiles);
        }
    }, [initialFiles]);

    useEffect(() => {
        return () => {
            files.forEach(f => URL.revokeObjectURL(f.previewUrl));
        };
    }, []);

    if (!isOpen) return null;


    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const preview = URL.createObjectURL(file);
            setSelectedFileObj({ file, preview });
            setZoom(1);
            setCrop({ x: 0, y: 0 });

            e.target.value = '';
        }
    };

    const handleCropComplete = (croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleSaveCroppedImage = async () => {
        if (!selectedFileObj || !croppedAreaPixels) return;

        try {
            const croppedFile = await getCroppedImg(
                selectedFileObj.preview,
                croppedAreaPixels
            );

            if (croppedFile) {
                const newFileItem: UploadedFile = {
                    id: Math.random().toString(36).substr(2, 9),
                    file: croppedFile,
                    previewUrl: URL.createObjectURL(croppedFile),
                    name: selectedFileObj.file.name,
                    size: formatFileSize(croppedFile.size),
                };

                const updatedFiles = [...files, newFileItem];
                setFiles(updatedFiles);

                if (onUploadComplete) {
                    onUploadComplete(updatedFiles.map(f => f.file));
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSelectedFileObj(null);
        }
    };

    const handleRemoveFile = (id: string) => {
        const updated = files.filter(f => f.id !== id);
        setFiles(updated);
        if (onUploadComplete) onUploadComplete(updated.map(f => f.file));
    };

    const handleSkipCrop = () => {
        if (!selectedFileObj) return;

        const newFileItem: UploadedFile = {
            id: Math.random().toString(36).substr(2, 9),
            file: selectedFileObj.file,
            previewUrl: selectedFileObj.preview,
            name: selectedFileObj.file.name,
            size: formatFileSize(selectedFileObj.file.size),
        };

        const updatedFiles = [...files, newFileItem];
        setFiles(updatedFiles);

        if (onUploadComplete) {
            onUploadComplete(updatedFiles.map(f => f.file));
        }
        setSelectedFileObj(null);
    };

    // 1. Editor View
    if (selectedFileObj) {
        return (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="w-full h-full sm:h-[600px] sm:w-[500px] bg-[#1e293b] sm:rounded-xl overflow-hidden flex flex-col animate-slide-up">
                    <div className="bg-[#0f172a] text-white p-4 flex items-center justify-between z-10 shadow-md">
                        <button
                            onClick={() => setSelectedFileObj(null)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h2 className="text-lg font-semibold">Crop & Edit</h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleSkipCrop}
                                className="px-3 py-1.5 text-slate-300 text-sm font-medium hover:text-white transition"
                            >
                                Skip
                            </button>
                            <button
                                onClick={handleSaveCroppedImage}
                                className="px-4 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-500 transition shadow-lg shadow-blue-900/20"
                            >
                                Save
                            </button>
                        </div>
                    </div>

                    <div className="relative flex-1 bg-black">
                        <Cropper
                            image={selectedFileObj.preview}
                            crop={crop}
                            zoom={zoom}
                            aspect={4 / 3}
                            onCropChange={setCrop}
                            onCropComplete={handleCropComplete}
                            onZoomChange={setZoom}
                            objectFit="contain"
                        />
                    </div>

                    <div className="p-6 bg-[#1e293b] text-white space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Zoom</span>
                            <span className="text-xs text-blue-400">{Math.round(zoom * 100)}%</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setZoom(Math.max(1, zoom - 0.1))} className="text-gray-400 hover:text-white">
                                <Minus size={18} />
                            </button>
                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <button onClick={() => setZoom(Math.min(3, zoom + 0.1))} className="text-gray-400 hover:text-white">
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Main List View
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm duration-200">
            <div className="w-full h-[85vh] sm:h-[600px] sm:w-[500px] bg-white rounded-t-2xl sm:rounded-xl overflow-hidden flex flex-col shadow-2xl">

                <div className="bg-blue-900 text-white p-4 flex items-center justify-between shadow-md shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <FileText size={16} className="text-white" />
                        </div>
                        <h2 className="text-lg font-semibold">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-white">
                    {files.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                            <div className="w-20 h-20 flex items-center justify-center mb-2">
                                <FileText size={32} className="text-slate-300" />
                            </div>
                            <div className="text-center">
                                <p className="text-base font-semibold text-slate-600">No files uploaded yet</p>
                                <p className="text-sm text-slate-400 mt-1 max-w-[200px] mx-auto">
                                    Files you scan or upload will appear here for review.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {files.map((file) => (
                                <div key={file.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4 group">

                                    <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100">
                                        <img src={file.previewUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-slate-800 truncate" title={file.name}>
                                            {file.name}
                                        </h4>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="text-xs text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                                                {file.size}
                                            </span>
                                            <span className="text-[10px] text-green-600 font-medium flex items-center gap-0.5 ml-2">
                                                <Check size={10} />
                                                Uploaded successfully
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleRemoveFile(file.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-blue-500 flex justify-around items-center gap-4 pb-6 sm:pb-4">
                    <div
                        onClick={() => cameraInputRef.current?.click()}
                        className="flex gap-2 items-center justify-center p-2 px-8 bg-blue-800 rounded-xl cursor-pointer hover:bg-blue-700 transition-all"
                    >
                        <input
                            ref={cameraInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                        <div className="text-white flex items-center justify-center">
                            <Camera size={20} />
                        </div>
                        <span className="text-sm font-bold text-white">Scan</span>
                    </div>

                    <div
                        onClick={() => galleryInputRef.current?.click()}
                        className="flex gap-2 items-center justify-center p-2 px-8 bg-blue-800 rounded-xl cursor-pointer hover:bg-blue-700 transition-all"
                    >
                        <input
                            ref={galleryInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                        <div className=" text-white flex items-center justify-center">
                            <Upload size={20} />
                        </div>
                        <span className="text-sm font-bold text-white">Upload</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
