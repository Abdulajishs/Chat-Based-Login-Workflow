import { WorkflowState } from "../types/auth";

export const SYSTEM_MESSAGES: Record<WorkflowState, string | null> = {
    unauthenticated: null,
    enteringPhone: "Please enter your mobile number",
    sendingOtp: null,
    waitingForOtp: "OTP sent. Please enter OTP",
    validatingOtp: "Validating OTP...",
    otpFailed: "Incorrect OTP. Type 'resend' to get a new OTP, or enter OTP again.",
    authenticated: "Login successful",
    vehiclebrandselection: null,
    vehiclemodelselection: null,
    vehiclevariantselection: null,
    uploadpan: "Please upload your PAN card",
    uploadesign: "Please upload your E-sign document",
    applicationsuccess: "Application submitted successfully. The loan id for the application is ID: 8563427 ",
};