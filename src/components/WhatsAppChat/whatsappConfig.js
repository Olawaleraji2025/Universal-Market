// Centralized WhatsApp configuration
// The business phone number may be provided via env var `VITE_WHATSAPP_NUMBER`.
// If not provided, a default number (supplied by the user) is used.
// Example .env: VITE_WHATSAPP_NUMBER=2348012345678

export const DEFAULT_WHATSAPP_NUMBER = "08109699494"; // user-supplied local number
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER;

export const PRE_FILLED_MESSAGE = `Hello Universal Market, I’m interested in your products and would like to know more.`;

function normalizeNumberForWa(number) {
  if (!number) return null;
  let s = String(number).trim();
  // remove any non-digit and non-plus characters
  s = s.replace(/[^+0-9]/g, "");
  // remove leading + if present
  if (s.startsWith("+")) s = s.slice(1);
  // convert local leading 0 to NG country code 234
  if (s.startsWith("0")) s = `234${s.slice(1)}`;
  return s;
}

export function buildWhatsAppUrl(number, message) {
  const cleaned = normalizeNumberForWa(number);
  if (!cleaned) return null;
  const encoded = encodeURIComponent(String(message));
  return `https://wa.me/${cleaned}?text=${encoded}`;
}
