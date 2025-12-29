import { WorkflowStates } from "@/types/auth";

export const SYSTEM_MESSAGES: Record<WorkflowStates, string | null> = {
  [WorkflowStates.UNAUTHENTICATED]: null,

  [WorkflowStates.ENTERING_PHONE]: "Please enter your mobile number",
  [WorkflowStates.SENDING_OTP]: null,
  [WorkflowStates.WAITING_FOR_OTP]: "OTP sent. Please enter OTP",
  [WorkflowStates.VALIDATING_OTP]: null,

  [WorkflowStates.OTP_FAILED]:
    "Incorrect OTP. Type 'resend' to get a new OTP, or enter OTP again.",

  [WorkflowStates.AUTHENTICATED]: "Login successful",

  [WorkflowStates.VEHICLE_BRAND_SELECTION]: null,
  [WorkflowStates.VEHICLE_MODEL_SELECTION]: null,
  [WorkflowStates.VEHICLE_VARIANT_SELECTION]: null,

  [WorkflowStates.UPLOAD_PAN]: "Please upload your PAN card",
  [WorkflowStates.UPLOAD_ESIGN]: "Please upload your E-sign document",

  [WorkflowStates.APPLICATION_SUCCESS]:
    "Application submitted successfully. The loan id for the application is ID: 8563427",
};