"use client";

import { History, Check, X } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { WorkflowState, WorkflowStates } from "@/types/auth";

export default function UserActivity() {
    const [isOpen, setIsOpen] = useState(false);
    const currentState = useSelector((state: RootState) => state.workflow.state);

    const steps = [
        {
            id: 1,
            label: "Login completed",
            isCompleted: (s: WorkflowState) => [
                WorkflowStates.VEHICLE_BRAND_SELECTION, WorkflowStates.VEHICLE_MODEL_SELECTION, WorkflowStates.VEHICLE_VARIANT_SELECTION,
                WorkflowStates.UPLOAD_PAN, WorkflowStates.UPLOAD_ESIGN, WorkflowStates.APPLICATION_SUCCESS
            ].includes(s)
        },
        {
            id: 2,
            label: "Vehicle selection",
            isCompleted: (s: WorkflowState) => [
                WorkflowStates.UPLOAD_PAN, WorkflowStates.UPLOAD_ESIGN, WorkflowStates.APPLICATION_SUCCESS
            ].includes(s)
        },
        {
            id: 3,
            label: "Upload PAN",
            isCompleted: (s: WorkflowState) => [
                WorkflowStates.UPLOAD_ESIGN, WorkflowStates.APPLICATION_SUCCESS
            ].includes(s)
        },
        {
            id: 4,
            label: "Upload Esign",
            isCompleted: (s: WorkflowState) => [
                WorkflowStates.APPLICATION_SUCCESS
            ].includes(s)
        },
        {
            id: 5,
            label: "Application submitted",
            isCompleted: (s: WorkflowState) => [
                WorkflowStates.APPLICATION_SUCCESS
            ].includes(s)
        }
    ];

    return (
        <>
            <div
                onClick={() => setIsOpen(true)}
                className="absolute bottom-20 right-8 w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all hover:scale-105 active:scale-95 z-40"
            >
                <History size={24} />
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div
                        className="bg-white rounded-2xl w-full max-w-sm shadow-2xl transform transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">Your Progress</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 relative">
                            {steps.map((step, index) => {
                                const completed = step.isCompleted(currentState);
                                const isLast = index === steps.length - 1;

                                return (
                                    <div key={step.id} className="flex gap-4 relative mb-1 last:mb-0">
                                        {!isLast && (
                                            <div
                                                className={`absolute left-[15px] top-[30px] bottom-[-20px] w-[2px] transition-colors duration-500 delay-100 ${completed ? "bg-green-500" : "bg-gray-200"
                                                    }`}
                                            ></div>
                                        )}

                                        <div className="relative z-10 flex flex-col items-center">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${completed
                                                        ? "bg-green-500 border-green-500 text-white shadow-md shadow-green-200"
                                                        : "bg-white border-gray-200 text-gray-300"
                                                    }`}
                                            >
                                                {completed ? (
                                                    <Check size={16} strokeWidth={3} />
                                                ) : (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 pt-1 pb-8">
                                            <p className={`font-medium text-base transition-colors duration-300 ${completed ? "text-green-700" : "text-gray-400"
                                                }`}>
                                                {step.label}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="absolute inset-0 -z-10" onClick={() => setIsOpen(false)} />
                </div>
            )}
        </>
    );
}