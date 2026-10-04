import { buildWhatsAppUrl } from '../../lib/whatsappConfig';

/**
 * Extracts a friendly first name from customer's name, or defaults to "there".
 */
export function getCustomerFirstName(fullName) {
  if (!fullName || typeof fullName !== 'string') return 'there';
  const trimmed = fullName.trim();
  if (!trimmed || trimmed.toLowerCase() === 'guest') return 'there';
  // Grab the first word
  const firstWord = trimmed.split(/\s+/)[0];
  return firstWord || 'there';
}

/**
 * Builds the customized WhatsApp message based on request status
 */
export function getWhatsAppMessage(status, customerName, itemName) {
  const firstName = getCustomerFirstName(customerName);
  const item = itemName ? itemName.trim() : 'your requested item';

  switch (status) {
    case 'Confirmed':
      return `Hello ${firstName}, your request for ${item} is confirmed. Here are the next steps: `;
    case 'Completed':
      return `Hello ${firstName}, thank you for choosing Universal Market. Please tell us how ${item} is working for you.`;
    case 'Cancelled':
      return `Hello ${firstName}, we have cancelled your request for ${item}. You can send a new request any time.`;
    case 'Pending':
    default:
      return `Hello ${firstName}, this is Universal Market. We received your request for ${item}. Are you still interested?`;
  }
}

/**
 * Constructs the wa.me link with pre-filled message
 */
export function buildAdminWhatsAppUrl(phone, status, customerName, itemName) {
  if (!phone) return null;
  const message = getWhatsAppMessage(status, customerName, itemName);
  return buildWhatsAppUrl(phone, message);
}
