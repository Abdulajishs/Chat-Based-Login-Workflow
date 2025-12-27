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
import { STORAGE_KEYS } from "@/types/auth";
import { phoneSchema, otpSchema } from "@/utils/validation";

export const sendOtpThunk = createAsyncThunk<void, void, { dispatch: AppDispatch; state: RootState }>(
    "workflow/sendOtp", async (_, { dispatch }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        dispatch(setWorkflowState("waitingForOtp"));
    });

export const validateOtpThunk = createAsyncThunk<void, string, { dispatch: AppDispatch }>(
    "workflow/validateOtp", async (otp, { dispatch }) => {
        dispatch(setWorkflowState("validatingOtp"));

        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (otp === "123456") {
            dispatch(setWorkflowState("authenticated"));
        } else {
            dispatch(setWorkflowState("otpFailed"));
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

        const isVehicleSelection = ["vehiclebrandselection", "vehiclemodelselection"].includes(state);

        if (!isVehicleSelection) {
            let finalMessage = messageText;
            if (state === "vehiclevariantselection") {
                const variant = String(input).trim();
                finalMessage = `Brand: ${vehicleData.brand} - Model: ${vehicleData.model} - Variant: ${variant}`;
            }
            dispatch(addMessage({ from: "user", text: finalMessage }));
        }


        if (input instanceof File) {
            if (state === "uploadpan") dispatch(panUploaded());
            if (state === "uploadesign") dispatch(esignUploaded());
            return;
        }

        const textInput = String(input).trim();

        if (textInput.toLowerCase() === "logout") {
            dispatch(logout());
            localStorage.removeItem(STORAGE_KEYS.WORKFLOW_STATE);
            localStorage.removeItem(STORAGE_KEYS.WORKFLOW_MESSAGES);
            return;
        }

        // State Specific Logic
        switch (state) {
            case "enteringPhone":
                const phoneCheck = phoneSchema.safeParse(textInput);
                if (!phoneCheck.success) {
                    dispatch(addMessage({ from: "system", text: phoneCheck.error.issues[0].message, isError: true }));
                } else {
                    dispatch(enterPhone(textInput));
                }
                break;

            case "waitingForOtp":
            case "otpFailed":
                if (state === "otpFailed" && textInput.toLowerCase() === "resend") {
                    dispatch(setWorkflowState("sendingOtp"));
                    return;
                }
                const otpCheck = otpSchema.safeParse(textInput);
                if (!otpCheck.success) {
                    dispatch(addMessage({ from: "system", text: otpCheck.error.issues[0].message, isError: true }));
                } else {
                    // Dispatch the separate validation thunk
                    dispatch(validateOtpThunk(textInput));
                }
                break;

            case "vehiclebrandselection":
                if (textInput) dispatch(selectVehicleBrand(textInput));
                break;

            case "vehiclemodelselection":
                if (textInput) dispatch(selectVehicleModel(textInput));
                break;

            case "vehiclevariantselection":
                if (textInput) dispatch(selectVehicleVariant(textInput));
                break;

            default:
                break;
        }
    }
);

