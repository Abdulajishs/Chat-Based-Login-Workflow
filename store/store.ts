import { configureStore } from "@reduxjs/toolkit";
import workflowReducer from "./workflow/workflow-slice";
import { STORAGE_KEYS } from "@/types/auth";

export const store = configureStore({
    reducer: {
        workflow: workflowReducer,
    }
})

if (typeof window !== "undefined") {
    store.subscribe(() => {
        const state = store.getState().workflow;
        localStorage.setItem(STORAGE_KEYS.WORKFLOW_STATE, state.state);
        localStorage.setItem(STORAGE_KEYS.WORKFLOW_MESSAGES, JSON.stringify(state.messages));
        localStorage.setItem(STORAGE_KEYS.WORKFLOW_VEHICLE_DATA, JSON.stringify(state.vehicleData));
    });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
