import { z } from "zod";

// This file holds Zod schemas.
// Zod is used to validate and parse user input safely.

// A small helper schema for "required non-empty string" values.
// We also trim whitespace so inputs like "   John   " become "John".
const nonEmptyTrimmedString = z
  .string()
  .trim() // Remove leading and trailing whitespace.
  .min(1, { message: "This field is required." }); // Ensure it's not empty after trim.

// A schema for Full Name.
// Rules: must be a non-empty string.
export const fullNameSchema = nonEmptyTrimmedString;

// A schema for WhatsApp or Phone number.
// Rules (practical):
// - Must be a string.
// - After trimming, length must be at least 7 characters.
// - Must contain only digits, spaces, +, -, and parentheses.
//   (This supports formats like 234 80..., +234-801..., (080) 123...)
export const contactSchema = z
  .string()
  .trim()
  .min(7, { message: "Enter a valid phone/WhatsApp number." })
  .regex(/^[0-9+\-()\s]+$/, {
    message: "Phone/WhatsApp number contains invalid characters.",
  });

// A schema for the optional message.
// Rules:
// - If present, it must be a string.
// - It is allowed to be empty (because the UI calls it optional).
// - We limit length to keep requests reasonable.
export const optionalMessageSchema = z
  .string()
  .trim()
  .max(500, { message: "Message is too long (max 500 characters)." })
  .optional();

// A schema for the "agree to be contacted" checkbox.
// Rules:
// - It must be true.
// This prevents submitting the form unless the user checked consent.
export const termsAcceptedSchema = z
  .boolean()
  .refine((val) => val === true, {
    message: "You must agree to be contacted.",
  });

// The final schema for the GuestForm.
// It describes the exact shape of the data we expect.
export const guestFormSchema = z.object({
  // Full name field.
  fullName: fullNameSchema,

  // WhatsApp or phone.
  contact: contactSchema,

  // Optional message.
  message: optionalMessageSchema,
});

// Example usage:
// const parsed = guestFormSchema.safeParse(formValues);
// if (!parsed.success) { parsed.error } else { parsed.data }

