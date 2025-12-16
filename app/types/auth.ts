
export type WorkflowState =
    | "unauthenticated"
    | "enteringPhone"
    | "sendingOtp"
    | "waitingForOtp"
    | "validatingOtp"
    | "otpFailed"
    | "authenticated"
    | "vehiclebrandselection"
    | "vehiclemodelselection"
    | "vehiclevariantselection"
    | "uploadpan"
    | "uploadesign"
    | "applicationsuccess";

export type WorkflowEvent =
    | { type: "ENTER_PHONE"; phone: string }
    | { type: "SEND_OTP" }
    | { type: "OTP_SUCCESS" }
    | { type: "OTP_FAIL" }
    | { type: "RESEND_OTP" }
    | { type: "LOGIN_SUCCESS" }
    | { type: "PAN_UPLOADED"; file: File }
    | { type: "ESIGN_UPLOADED"; file: File }
    | { type: "LOGOUT" }
    | { type: "VALIDATE_OTP" }
    | { type: "SELECT_OPTION"; payload: string }
    | { type: "HYDRATE_STATE"; payload: WorkflowState };



export const STORAGE_KEYS = {
    WORKFLOW_MESSAGES: "workflow_messages",
    WORKFLOW_STATE: "workflow_state",
};

