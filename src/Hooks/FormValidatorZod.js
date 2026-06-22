import { guestFormSchema } from "../lib/zodSchemas";

// This file provides Zod-based validation helpers for the Guest form.
// It mirrors what a non-Zod validator would do, but using Zod for parsing/validation.

// Validate GuestForm values.
// It returns a simple shape that components can easily consume.
export function validateGuestForm(values) {
  // safeParse validates and parses without throwing.
  // - success: true => values are valid and parsed data is in result.data
  // - success: false => errors are in result.error
  const result = guestFormSchema.safeParse(values);

  // If validation fails, return a friendly error object.
  if (!result.success) {
    // Flatten issues into { fieldName: [messages] }.
    // This makes it easy to show per-field errors in the UI.
    const fieldErrors = {};

    for (const issue of result.error.issues) {
      // issue.path is an array; we expect first item to be the field name.
      const field = issue.path?.[0] ?? "form";
      fieldErrors[field] = fieldErrors[field] ?? [];
      fieldErrors[field].push({ message: issue.message });
    }

    return {
      valid: false,
      errors: fieldErrors,
      data: null,
    };
  }

  // If validation succeeds, return parsed/validated data.
  return {
    valid: true,
    errors: {},
    data: result.data,
  };
}

