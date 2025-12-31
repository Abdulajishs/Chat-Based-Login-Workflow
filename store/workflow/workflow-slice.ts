import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WorkflowState, ChatMessage, WorkflowStates, MessageFrom, MessageType } from "@/types/auth";
import { SYSTEM_MESSAGES } from "@/lib/workflow-config";
import { chatMessageSchema } from "@/utils/validation";

type VehicleData = {
  brand: string;
  model: string;
  variant: string;
};

interface WorkflowSliceState {
  state: WorkflowState;
  messages: ChatMessage[];
  vehicleData: VehicleData;
  hydrated: boolean;
}

const initialState: WorkflowSliceState = {
  state: WorkflowStates.UNAUTHENTICATED,
  messages: [],
  vehicleData: { brand: "", model: "", variant: "" },
  hydrated: false,
};


const pushSystemMessage = (state: WorkflowSliceState, newState: WorkflowState) => {
  const msgText = SYSTEM_MESSAGES[newState];

  if (msgText) {
    state.messages.push({
      from: MessageFrom.SYSTEM,
      text: msgText,
      isError: newState === WorkflowStates.OTP_FAILED
    });
  }

  if (newState === WorkflowStates.VEHICLE_BRAND_SELECTION) {
    const hasVehicleMsg = state.messages.some(m => m.type === MessageType.VEHICLE_SELECTION);
    if (!hasVehicleMsg) {
      state.messages.push({ from: MessageFrom.SYSTEM, type: MessageType.VEHICLE_SELECTION });
    }
  }
};

const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    hydrateState(state, action: PayloadAction<{ state: WorkflowState; messages: ChatMessage[]; vehicleData?: VehicleData }>) {
      state.state = action.payload.state;
      state.messages = action.payload.messages;
      if (action.payload.vehicleData) {
        state.vehicleData = action.payload.vehicleData;
      }
      state.hydrated = true;
    },

    logout(state) {
      state.state = WorkflowStates.UNAUTHENTICATED;
      state.messages = [];
      state.vehicleData = { brand: "", model: "", variant: "" };
    },

    addMessage(state, action: PayloadAction<ChatMessage>) {
      const result = chatMessageSchema.safeParse(action.payload);
      if (result.success) {
        state.messages.push(action.payload);
      } else {
        console.error("Invalid message payload:", result.error);
      }
    },

    setWorkflowState(state, action: PayloadAction<WorkflowState>) {
      state.state = action.payload;
      pushSystemMessage(state, action.payload);
    },

    enterPhone(state, action: PayloadAction<string>) {
      state.state = WorkflowStates.SENDING_OTP;
      pushSystemMessage(state, WorkflowStates.SENDING_OTP);
    },

    loginSuccess(state) {
      state.state = WorkflowStates.VEHICLE_BRAND_SELECTION;
      pushSystemMessage(state, WorkflowStates.VEHICLE_BRAND_SELECTION);
    },

    selectVehicleBrand(state, action: PayloadAction<string>) {
      state.vehicleData = { brand: action.payload, model: "", variant: "" };
      state.state = WorkflowStates.VEHICLE_MODEL_SELECTION;
      pushSystemMessage(state, WorkflowStates.VEHICLE_MODEL_SELECTION);
    },

    selectVehicleModel(state, action: PayloadAction<string>) {
      state.vehicleData.model = action.payload;
      state.vehicleData.variant = "";
      state.state = WorkflowStates.VEHICLE_VARIANT_SELECTION;
      pushSystemMessage(state, WorkflowStates.VEHICLE_VARIANT_SELECTION);
    },

    selectVehicleVariant(state, action: PayloadAction<string>) {
      state.vehicleData.variant = action.payload;
      state.state = WorkflowStates.UPLOAD_PAN;
      pushSystemMessage(state, WorkflowStates.UPLOAD_PAN);
    },

    panUploaded(state) {
      state.state = WorkflowStates.UPLOAD_ESIGN;
      pushSystemMessage(state, WorkflowStates.UPLOAD_ESIGN);
    },

    esignUploaded(state) {
      state.state = WorkflowStates.APPLICATION_SUCCESS;
      pushSystemMessage(state, WorkflowStates.APPLICATION_SUCCESS);
    },

    setMessages(state, action: PayloadAction<ChatMessage[]>) {
      state.messages = action.payload;
    },

    updateVehicleData(state, action: PayloadAction<VehicleData>) {
      state.vehicleData = action.payload;
    }
  },
});

export const {
  hydrateState,
  logout,
  addMessage,
  setWorkflowState,
  enterPhone,
  loginSuccess,
  selectVehicleBrand,
  selectVehicleModel,
  selectVehicleVariant,
  panUploaded,
  esignUploaded,
  setMessages,
  updateVehicleData
} = workflowSlice.actions;

export default workflowSlice.reducer;
