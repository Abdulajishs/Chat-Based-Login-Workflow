import { WorkflowState } from "../types/auth";

export const SYSTEM_MESSAGES: Record<WorkflowState, string | null> = {
    unauthenticated: null,
    enteringPhone: "Please enter your mobile number",
    sendingOtp: "Sending OTP...",
    waitingForOtp: "OTP sent. Please enter OTP",
    validatingOtp: "Validating OTP...",
    otpFailed: "Incorrect OTP. Type 'resend' to get a new OTP, or enter OTP again.",
    authenticated: "Login successful",
    vehiclebrandselection: "Select vehicle brand",
    vehiclemodelselection: "Select vehicle model",
    vehiclevariantselection: "Select vehicle variant",
    uploadpan: "Please upload your PAN card",
    uploadesign: "Please upload your E-sign document",
    applicationsuccess: "Application submitted successfully. The loan id for the application is ID: 8563427 ",
};