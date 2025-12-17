"use client";

import { useEffect, useReducer, useState } from "react";
import { WorkflowEvent, WorkflowState, STORAGE_KEYS } from "../types/auth";
import {SYSTEM_MESSAGES} from "../config/workflowConfig"

export type ChatMessage = {
    from: "system" | "user";
    text: string;
};

function reducer(state: WorkflowState, event: WorkflowEvent): WorkflowState {
    if (event.type === "LOGOUT") return "unauthenticated";

    if (event.type === "HYDRATE_STATE") {
        return event.payload;
    }

    switch (state) {
        case "unauthenticated":
            if (event.type === "LOGIN_SUCCESS") return "vehiclebrandselection";
            return "enteringPhone";

        case "enteringPhone":
            if (event.type === "ENTER_PHONE") return "sendingOtp";
            return state;

        case "sendingOtp":
            if (event.type === "SEND_OTP") return "waitingForOtp";
            return state;

        case "waitingForOtp":
            if (event.type === "VALIDATE_OTP") return "validatingOtp";
            return state;

        case "validatingOtp":
            if (event.type === "OTP_SUCCESS") return "authenticated";
            if (event.type === "OTP_FAIL") return "otpFailed";
            return state;

        case "otpFailed":
            if (event.type === "RESEND_OTP") return "sendingOtp";
            if (event.type === "VALIDATE_OTP") return "validatingOtp";
            return state;

        case "authenticated":
            if (event.type === "LOGIN_SUCCESS") return "vehiclebrandselection";
            return state;

        case "vehiclebrandselection":
            if (event.type === "SELECT_OPTION") return "vehiclemodelselection";
            return state;

        case "vehiclemodelselection":
            if (event.type === "SELECT_OPTION") return "vehiclevariantselection";
            return state;

        case "vehiclevariantselection":
            if (event.type === "SELECT_OPTION") return "uploadpan";
            return state;

        case "uploadpan":
            if (event.type === "PAN_UPLOADED") return "uploadesign";
            return state;

        case "uploadesign":
            if (event.type === "ESIGN_UPLOADED") return "applicationsuccess";
            return state;

        default:
            return state;
    }
}



export function useWorkflowMachine() {
    const [state, dispatch] = useReducer(reducer, "unauthenticated");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [hydrated, setHydrated] = useState(false);

    //After hydration, local storage restore
    useEffect(() => {
        const savedState = localStorage.getItem(STORAGE_KEYS.WORKFLOW_STATE);
        const savedMessages = localStorage.getItem(STORAGE_KEYS.WORKFLOW_MESSAGES);

        if (savedState) {
            dispatch({
                type: "HYDRATE_STATE",
                payload: savedState as WorkflowState,
            });
        }

        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }

        setHydrated(true);
    }, []);


    useEffect(() => {
        if (!hydrated) return;
        if (state !== "unauthenticated") return;

        const mockSessionCheck = async () => {
            const hasSession = false;

            if (hasSession) {
                dispatch({ type: "LOGIN_SUCCESS" });
            } else {
                dispatch({ type: "ENTER_PHONE", phone: "" });
            }
        };

        mockSessionCheck();
    }, [hydrated, state]);


    useEffect(() => {
        if (!hydrated) return;

        if (state === "sendingOtp") {
            // Simulate API call using static response
            const apiCall = async () => {
                const STATIC_API_RESPONSE = {
                    success: true,
                    message: "OTP sent successfully",
                };

                await new Promise((resolve) => setTimeout(resolve, 1000));

                if (STATIC_API_RESPONSE.success) {
                    dispatch({ type: "SEND_OTP" });
                }
            };

            apiCall();
        }

        if (state === "authenticated") {
            const t = setTimeout(() => dispatch({ type: "LOGIN_SUCCESS" }), 1000);
            return () => clearTimeout(t);
        }
    }, [state, hydrated]);

    //Persistence + system messages
    useEffect(() => {
        if (!hydrated) return;

        localStorage.setItem(STORAGE_KEYS.WORKFLOW_STATE, state);

        const msg = SYSTEM_MESSAGES[state];
        if (!msg) return;

        setMessages((prev) => {
            const last = prev.at(-1);
            if (last?.from === "system" && last?.text === msg) return prev;
            return [...prev, { from: "system", text: msg }];
        });
    }, [state, hydrated]);

    useEffect(() => {
        if (!hydrated) return;
        localStorage.setItem(
            STORAGE_KEYS.WORKFLOW_MESSAGES,
            JSON.stringify(messages)
        );
    }, [messages, hydrated]);

    //Based on User Interaction
    function sendUserMessage(input: string | File) {

        if (input instanceof File) {
            setMessages((prev) => [...prev, { from: "user", text: `Uploaded: ${input.name}` }]);
        } else {
            setMessages((prev) => [...prev, { from: "user", text: String(input) }]);
        }

        if (state === "enteringPhone") {
            const phone = String(input).trim();
            if (phone) dispatch({ type: "ENTER_PHONE", phone });
        }

        if (state === "waitingForOtp" || state === "otpFailed") {
            const text = String(input).trim();

            if (state === "otpFailed" && text.toLowerCase() === "resend") {
                dispatch({ type: "RESEND_OTP" });
                return;
            }

            dispatch({ type: "VALIDATE_OTP" });

            setTimeout(() => {
                text === "123456"
                    ? dispatch({ type: "OTP_SUCCESS" })
                    : dispatch({ type: "OTP_FAIL" });
            }, 1500);
        }

        if (
            state === "vehiclebrandselection" ||
            state === "vehiclemodelselection" ||
            state === "vehiclevariantselection"
        ) {
            if (typeof input === "string" && input.trim()) {
                dispatch({ type: "SELECT_OPTION", payload: input });
            }
        }

        if (state === "uploadpan" && input instanceof File) {
            dispatch({ type: "PAN_UPLOADED", file: input });
        }

        if (state === "uploadesign" && input instanceof File) {
            dispatch({ type: "ESIGN_UPLOADED", file: input });
        }

        if (typeof input === "string" && input.toLowerCase() === "logout") {
            dispatch({ type: "LOGOUT" });
            setMessages([]);
            localStorage.removeItem(STORAGE_KEYS.WORKFLOW_STATE);
            localStorage.removeItem(STORAGE_KEYS.WORKFLOW_MESSAGES);
        }
    }

    return { state, messages, sendUserMessage };
}
