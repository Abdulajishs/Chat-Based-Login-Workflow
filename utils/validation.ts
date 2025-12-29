import { z } from "zod";
import { WorkflowStates, MessageFrom, MessageType } from "@/types/auth";

export const phoneSchema = z.string().regex(/^[0-9]{10}$/, "Invalid phone number. Must be 10 digits.");
export const otpSchema = z.string().regex(/^[0-9]{6}$/, "Invalid OTP. Must be 6 digits.");

const getEnumValues = (enumObj: Record<string, string>) =>
    Object.values(enumObj) as [string, ...string[]];

export const workflowStateSchema = z.enum(getEnumValues(WorkflowStates));

export const chatMessageSchema = z.object({
    from: z.enum(getEnumValues(MessageFrom)),
    text: z.string().optional(),
    type: z.enum(getEnumValues(MessageType)).optional(),
    isError: z.boolean().optional(),
});

export const vehicleDataSchema = z.object({
    brand: z.string(),
    model: z.string(),
    variant: z.string(),
});

export const hydrationSchema = z.object({
    state: workflowStateSchema,
    messages: z.array(chatMessageSchema),
    vehicleData: vehicleDataSchema.optional(),
});
