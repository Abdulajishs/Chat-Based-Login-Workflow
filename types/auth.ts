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


export const STORAGE_KEYS = {
  WORKFLOW_MESSAGES: "workflow_messages",
  WORKFLOW_STATE: "workflow_state",
  WORKFLOW_VEHICLE_DATA: "workflow_vehicle_data",
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

