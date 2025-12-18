import { z } from "zod";

export const phoneSchema = z.string().regex(/^[0-9]{10}$/, "Invalid phone number. Must be 10 digits.");
export const otpSchema = z.string().regex(/^[0-9]{6}$/, "Invalid OTP. Must be 6 digits.");
