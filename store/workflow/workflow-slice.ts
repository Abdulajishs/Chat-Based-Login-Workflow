import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WorkflowState, ChatMessage } from "@/types/auth";
import { SYSTEM_MESSAGES } from "@/lib/workflow-config";

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
  state: "unauthenticated",
  messages: [],
  vehicleData: { brand: "", model: "", variant: "" },
  hydrated: false,
};


const pushSystemMessage = (state: WorkflowSliceState, newState: WorkflowState) => {
  const msgText = SYSTEM_MESSAGES[newState];

  if (msgText) {
    state.messages.push({
      from: "system",
      text: msgText,
      isError: newState === "otpFailed"
    });
  }

  if (newState === "vehiclebrandselection") {
    const hasVehicleMsg = state.messages.some(m => m.type === "VEHICLE_SELECTION");
    if (!hasVehicleMsg) {
      state.messages.push({ from: "system", type: "VEHICLE_SELECTION" });
    }
  }
};

const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    hydrateState(state, action: PayloadAction<{ state: WorkflowState; messages: ChatMessage[] }>) {
      state.state = action.payload.state;
      state.messages = action.payload.messages;
      state.hydrated = true;
    },

    logout(state) {
      state.state = "unauthenticated";
      state.messages = [];
      state.vehicleData = { brand: "", model: "", variant: "" };
    },

    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },

    setWorkflowState(state, action: PayloadAction<WorkflowState>) {
      state.state = action.payload;
      pushSystemMessage(state, action.payload);
    },

    enterPhone(state, action: PayloadAction<string>) {
      state.state = "sendingOtp";
      pushSystemMessage(state, "sendingOtp");
    },

    loginSuccess(state) {
      state.state = "vehiclebrandselection";
      pushSystemMessage(state, "vehiclebrandselection");
    },

    selectVehicleBrand(state, action: PayloadAction<string>) {
      state.vehicleData = { brand: action.payload, model: "", variant: "" };
      state.state = "vehiclemodelselection";
      pushSystemMessage(state, "vehiclemodelselection");
    },

    selectVehicleModel(state, action: PayloadAction<string>) {
      state.vehicleData.model = action.payload;
      state.vehicleData.variant = "";
      state.state = "vehiclevariantselection";
      pushSystemMessage(state, "vehiclevariantselection");
    },

    selectVehicleVariant(state, action: PayloadAction<string>) {
      state.vehicleData.variant = action.payload;
      state.state = "uploadpan";
      pushSystemMessage(state, "uploadpan");
    },

    panUploaded(state) {
      state.state = "uploadesign";
      pushSystemMessage(state, "uploadesign");
    },

    esignUploaded(state) {
      state.state = "applicationsuccess";
      pushSystemMessage(state, "applicationsuccess");
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
