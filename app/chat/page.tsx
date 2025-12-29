"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { triggerLoginNotification } from "@/app/actions/novu-actions";
import { ChatContainer } from "@/components/chat/chat-container";
import { RootState, AppDispatch } from "@/store/store";
import {
  updateVehicleData,
  setWorkflowState,
  loginSuccess,
  hydrateState
} from "@/store/workflow/workflow-slice";
import { submitUserMessage, sendOtpThunk } from "@/store/workflow/workflow-thunks";
import { WorkflowState, STORAGE_KEYS, WorkflowStates } from "@/types/auth";
import { SUBSCRIBER_ID } from "@/utils/constants";

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
      dispatch(hydrateState({ state: WorkflowStates.UNAUTHENTICATED, messages: [] }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!hydrated) return;
    if (state !== WorkflowStates.UNAUTHENTICATED) return;

    // Simulate session check
    const checkSession = async () => {
      const hasSession = false;
      if (hasSession) {
        dispatch(loginSuccess());
      } else {
        if (state === WorkflowStates.UNAUTHENTICATED) dispatch(setWorkflowState(WorkflowStates.ENTERING_PHONE));
      }
    };
    checkSession();
  }, [hydrated, state, dispatch]);

  useEffect(() => {
    if (state === WorkflowStates.SENDING_OTP) {
      dispatch(sendOtpThunk());
    }
  }, [state, dispatch]);

  useEffect(() => {
    if (state === WorkflowStates.AUTHENTICATED) {
      const t = setTimeout(() => {
        dispatch(loginSuccess());
        // Trigger notification
        triggerLoginNotification(SUBSCRIBER_ID);
      }, 1000);
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
