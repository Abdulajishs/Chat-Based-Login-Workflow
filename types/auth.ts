export enum WorkflowStates {
  UNAUTHENTICATED = "unauthenticated",
  ENTERING_PHONE = "enteringPhone",
  SENDING_OTP = "sendingOtp",
  WAITING_FOR_OTP = "waitingForOtp",
  VALIDATING_OTP = "validatingOtp",
  OTP_FAILED = "otpFailed",
  AUTHENTICATED = "authenticated",

  VEHICLE_BRAND_SELECTION = "vehiclebrandselection",
  VEHICLE_MODEL_SELECTION = "vehiclemodelselection",
  VEHICLE_VARIANT_SELECTION = "vehiclevariantselection",

  UPLOAD_PAN = "uploadpan",
  UPLOAD_ESIGN = "uploadesign",
  APPLICATION_SUCCESS = "applicationsuccess",
}


export type WorkflowState = WorkflowStates;

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

export enum MessageFrom {
  SYSTEM = "system",
  USER = "user",
}

export enum MessageType {
  VEHICLE_SELECTION = "VEHICLE_SELECTION",
}


export type ChatMessage = {
    from: MessageFrom;
    text?: string;
    type?: MessageType;
    isError?: boolean;
};

export enum CommandType {
  RESEND = "resend",
  LOGOUT = "logout",
}

