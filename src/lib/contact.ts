// Central contact details for SOULS Media Group
export const CONTACT = {
  whatsapp: "+18762959077", // digits only for wa.me URLs
  whatsappDisplay: "+1 876-295-9077",
  email: "souldesignsphotos@proton.me",
  // Set this when a scheduling link is available (e.g. https://calendly.com/...)
  scheduleUrl: "" as string,
} as const;

export const buildWhatsAppUrl = (message: string) =>
  `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

export const buildMailtoUrl = (subject: string, body: string) =>
  `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
