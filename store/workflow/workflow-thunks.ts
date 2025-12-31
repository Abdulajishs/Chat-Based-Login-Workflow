import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import {
    setWorkflowState,
    addMessage,
    enterPhone,
    selectVehicleBrand,
    selectVehicleModel,
    selectVehicleVariant,
    panUploaded,
    esignUploaded,
    logout
} from "./workflow-slice";
import { CommandType, MessageFrom, STORAGE_KEYS, WorkflowStates } from "@/types/auth";
import { phoneSchema, otpSchema, fileSchema } from "@/utils/validation";
import { VEHICLE_OPTIONS } from "@/types/vehicles";

export const sendOtpThunk = createAsyncThunk<void, void, { dispatch: AppDispatch; state: RootState }>(
    "workflow/sendOtp", async (_, { dispatch }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        dispatch(setWorkflowState(WorkflowStates.WAITING_FOR_OTP));
    });

export const validateOtpThunk = createAsyncThunk<void, string, { dispatch: AppDispatch }>(
    "workflow/validateOtp", async (otp, { dispatch }) => {
        dispatch(setWorkflowState(WorkflowStates.VALIDATING_OTP));

        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (otp === "123456") {
            dispatch(setWorkflowState(WorkflowStates.AUTHENTICATED));
        } else {
            dispatch(setWorkflowState(WorkflowStates.OTP_FAILED));
        }
    });


export const submitUserMessage = createAsyncThunk<void, string | File, { dispatch: AppDispatch; state: RootState }>(
    "workflow/submitUserMessage",
    async (input, { dispatch, getState }) => {
        const { state, vehicleData } = getState().workflow;

        let messageText = "";
        if (input instanceof File) {
            messageText = `Uploaded: ${input.name}`;
        } else {
            messageText = String(input);
        }

        const isVehicleSelection = [WorkflowStates.VEHICLE_BRAND_SELECTION, WorkflowStates.VEHICLE_MODEL_SELECTION].includes(state);

        if (!isVehicleSelection) {
            let finalMessage = messageText;
            if (state === WorkflowStates.VEHICLE_VARIANT_SELECTION) {
                const variant = String(input).trim();
                finalMessage = `Brand: ${vehicleData.brand} - Model: ${vehicleData.model} - Variant: ${variant}`;
            }
            dispatch(addMessage({ from: MessageFrom.USER, text: finalMessage }));
        }


        if (input instanceof File) {
            const fileCheck = fileSchema.safeParse(input);
            if (!fileCheck.success) {
                dispatch(addMessage({ from: MessageFrom.SYSTEM, text: "Invalid file format.", isError: true }));
                return;
            }

            if (state === WorkflowStates.UPLOAD_PAN) dispatch(panUploaded());
            if (state === WorkflowStates.UPLOAD_ESIGN) dispatch(esignUploaded());
            return;
        }

        const textInput = String(input).trim();

        if (textInput.toLowerCase() === CommandType.LOGOUT) {
            dispatch(logout());
            localStorage.removeItem(STORAGE_KEYS.WORKFLOW_STATE);
            localStorage.removeItem(STORAGE_KEYS.WORKFLOW_MESSAGES);
            return;
        }

        // State Specific Logic
        switch (state) {
            case WorkflowStates.ENTERING_PHONE:
                const phoneCheck = phoneSchema.safeParse(textInput);
                if (!phoneCheck.success) {
                    dispatch(addMessage({ from: MessageFrom.SYSTEM, text: phoneCheck.error.issues[0].message, isError: true }));
                } else {
                    dispatch(enterPhone(textInput));
                }
                break;

            case WorkflowStates.WAITING_FOR_OTP:
            case WorkflowStates.OTP_FAILED:
                if (state === WorkflowStates.OTP_FAILED && textInput.toLowerCase() === CommandType.RESEND) {
                    dispatch(setWorkflowState(WorkflowStates.SENDING_OTP));
                    return;
                }
                const otpCheck = otpSchema.safeParse(textInput);
                if (!otpCheck.success) {
                    dispatch(addMessage({ from: MessageFrom.SYSTEM, text: otpCheck.error.issues[0].message, isError: true }));
                } else {
                    // Dispatch the separate validation thunk
                    dispatch(validateOtpThunk(textInput));
                }
                break;

            case "vehiclebrandselection":
                if (VEHICLE_OPTIONS.vehiclebrandselection.includes(textInput)) {
                    dispatch(selectVehicleBrand(textInput));
                } else {
                    dispatch(addMessage({ from: MessageFrom.SYSTEM, text: "Invalid Brand selected.", isError: true }));
                }
                break;

            case "vehiclemodelselection":
                if (VEHICLE_OPTIONS.vehiclemodelselection.includes(textInput)) {
                    dispatch(selectVehicleModel(textInput));
                } else {
                    dispatch(addMessage({ from: MessageFrom.SYSTEM, text: "Invalid Model selected.", isError: true }));
                }
                break;

            case "vehiclevariantselection":
                if (VEHICLE_OPTIONS.vehiclevariantselection.includes(textInput)) {
                    dispatch(selectVehicleVariant(textInput));
                } else {
                    dispatch(addMessage({ from: MessageFrom.SYSTEM, text: "Invalid Variant selected.", isError: true }));
                }
                break;

            default:
                break;
        }
    }
);

