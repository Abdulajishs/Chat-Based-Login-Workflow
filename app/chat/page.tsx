"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { RootState, AppDispatch } from "@/store/store";
import {
  updateVehicleData,
  setWorkflowState,
  loginSuccess,
  hydrateState
} from "@/store/workflow/workflowSlice";
import { submitUserMessage, sendOtpThunk } from "@/store/workflow/workflowThunks";
import { WorkflowState, STORAGE_KEYS } from "@/types/auth";

export default function ChatPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { state, messages, vehicleData, hydrated } = useSelector(
    (s: RootState) => s.workflow
  );

  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEYS.WORKFLOW_STATE);
    const savedMessages = localStorage.getItem(STORAGE_KEYS.WORKFLOW_MESSAGES);

    if (savedState && savedMessages) {
      dispatch(hydrateState({
        state: savedState as WorkflowState,
        messages: JSON.parse(savedMessages)
      }));
    } else {
      dispatch(hydrateState({ state: "unauthenticated", messages: [] }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!hydrated) return;
    if (state !== "unauthenticated") return;

    // Simulate session check
    const checkSession = async () => {
      const hasSession = false;
      if (hasSession) {
        dispatch(loginSuccess());
      } else {
        if (state === "unauthenticated") dispatch(setWorkflowState("enteringPhone"));
      }
    };
    checkSession();
  }, [hydrated, state, dispatch]);

  useEffect(() => {
    if (state === "sendingOtp") {
      dispatch(sendOtpThunk());
    }
  }, [state, dispatch]);

  useEffect(() => {
    if (state === "authenticated") {
      const t = setTimeout(() => dispatch(loginSuccess()), 1000);
      return () => clearTimeout(t);
    }
  }, [state, dispatch]);


  const handleSendUserMessage = (input: string | File) => {
    dispatch(submitUserMessage(input));
  };

  const handleSetVehicleData = (dataOrUpdater: any) => {
    // Handle both functional updates and direct values for compatibility
    const newData = typeof dataOrUpdater === 'function'
      ? dataOrUpdater(vehicleData)
      : dataOrUpdater;
    dispatch(updateVehicleData(newData));
  };

  const handleSetWorkflowState = (newState: WorkflowState) => {
    dispatch(setWorkflowState(newState));
  };

  return (
    <ChatContainer
      state={state}
      messages={messages}
      vehicleData={vehicleData}
      sendUserMessage={handleSendUserMessage}
      setVehicleData={handleSetVehicleData}
      setWorkflowState={handleSetWorkflowState}
    />
  );
}
