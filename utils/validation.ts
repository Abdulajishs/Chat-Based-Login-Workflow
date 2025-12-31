import { z } from "zod";
import { WorkflowStates, MessageFrom, MessageType } from "@/types/auth";
import { VEHICLE_OPTIONS } from "@/types/vehicles";

function createEnumFromOptions(options: string[]) {
    if (options.length === 0) return z.string();
    return z.enum(options as [string, ...string[]]);
}

function createNativeEnumSchema<T extends object>(enumObj: T) {
    const values = Object.values(enumObj) as [string, ...string[]];
    return z.enum(values);
}

export const phoneSchema = z.string()
    .regex(/^[0-9]{10}$/, "Invalid phone number. Must be 10 digits.");

export const otpSchema = z.string()
    .regex(/^[0-9]{6}$/, "Invalid OTP. Must be 6 digits.");

export const workflowStateSchema = createNativeEnumSchema(WorkflowStates);
export const messageFromSchema = createNativeEnumSchema(MessageFrom);
export const messageTypeSchema = createNativeEnumSchema(MessageType);

export const vehicleDataSchema = z.object({
    brand: createEnumFromOptions(VEHICLE_OPTIONS.vehiclebrandselection).or(z.literal("")),
    model: createEnumFromOptions(VEHICLE_OPTIONS.vehiclemodelselection).or(z.literal("")),
    variant: createEnumFromOptions(VEHICLE_OPTIONS.vehiclevariantselection).or(z.literal("")),
});

export const chatMessageSchema = z.object({
    from: messageFromSchema,
    text: z.string().optional(),
    type: messageTypeSchema.optional(),
    isError: z.boolean().optional(),
});

export const fileSchema = z.custom<File>((val) => {
    return typeof File !== "undefined" && val instanceof File;
}, "Must be a File object");

export const hydrationSchema = z.object({
    state: workflowStateSchema,
    messages: z.array(chatMessageSchema),
    vehicleData: vehicleDataSchema.optional(),
});
