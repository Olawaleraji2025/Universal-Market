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
    message: "Please agree before submiting.",
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

  termsAccepted: termsAcceptedSchema,
});

// ---------------------------------------------------------------------------
// RequestModal schema (src/components/Layout/RequestModal.jsx)
// ---------------------------------------------------------------------------

// A schema for the item name a user is looking for.
// Rules: must be a non-empty trimmed string.
export const itemNameSchema = nonEmptyTrimmedString;

// A schema for the item category.
// Rules: must be a non-empty trimmed string (a category must be chosen).
export const categorySchema = nonEmptyTrimmedString;

// A schema for the estimated budget (display string, e.g. "450,000").
// Rules:
// - Optional (the user may leave it blank).
// - If present, must be a string of digits and commas only.
// - After stripping commas, it must parse to a finite number > 0.
export const budgetSchema = z
  .string()
  .trim()
  .optional()
  .refine((val) => {
    if (val == null || val === "") return true; // empty budget is allowed
    const cleaned = String(val).replace(/,/g, "").trim();
    if (!cleaned) return false;
    const num = Number(cleaned);
    return Number.isFinite(num) && num > 0;
  }, {
    message: "Enter a valid budget amount, e.g. 450,000",
  });

// A schema for the optional item details / specs.
// Rules: optional, trimmed, max length 1000.
export const itemDetailsSchema = z
  .string()
  .trim()
  .max(1000, { message: "Details are too long (max 1000 characters)." })
  .optional();

// A schema for the phone/WhatsApp contact on the request form.
// Rules:
// - Must be a non-empty trimmed string.
// - Must contain at least 11 digits (Nigerian phone format).
// - Must only contain digits, spaces, +, -, and parentheses.
export const requestContactSchema = z
  .string()
  .trim()
  .min(1, { message: "We need a WhatsApp or phone number to reach you." })
  .refine((val) => String(val).replace(/\D/g, "").length >= 11, {
    message: "Enter a valid phone/WhatsApp number.",
  })
  .regex(/^[0-9+\-()\s]+$/, {
    message: "Phone/WhatsApp number contains invalid characters.",
  });

// The final schema for the RequestModal form.
// It describes the exact shape of the data react-hook-form validates.
export const requestItemSchema = z.object({
  itemName: itemNameSchema,
  category: categorySchema,
  budget: budgetSchema,
  details: itemDetailsSchema,
  contact: requestContactSchema,
});


