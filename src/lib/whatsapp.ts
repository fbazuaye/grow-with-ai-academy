// Placeholder WhatsApp number — swap when ready.
export const WHATSAPP_NUMBER = "2347054265401";
export const SITE_NAME = "AI Mastery Academy";

export function whatsappLink(programTitle?: string) {
  const msg = programTitle
    ? `Hi, I'm interested in the "${programTitle}" program. Please share details.`
    : `Hi, I'd like to know more about ${SITE_NAME}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
