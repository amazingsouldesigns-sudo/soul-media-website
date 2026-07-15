import { motion } from "framer-motion";
import { Mail, MessageCircle } from "lucide-react";
import { CONTACT, buildWhatsAppUrl, buildMailtoUrl } from "@/lib/contact";

const bubbles = [
  {
    icon: MessageCircle,
    label: `WhatsApp ${CONTACT.whatsappDisplay}`,
    href: buildWhatsAppUrl("Hi SOULS Media Group, I'd like to start a project."),
    external: true,
  },
  {
    icon: Mail,
    label: `Email ${CONTACT.email}`,
    href: buildMailtoUrl("Project enquiry - SOULS Media Group", "Hi SOULS Media Group,"),
    external: false,
  },
];

const FloatingContact = () => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {bubbles.map((bubble, i) => {
        const Icon = bubble.icon;
        return (
          <motion.a
            key={bubble.label}
            href={bubble.href}
            target={bubble.external ? "_blank" : undefined}
            rel={bubble.external ? "noopener noreferrer" : undefined}
            aria-label={bubble.label}
            title={bubble.label}
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.6 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/80 backdrop-blur-xl text-foreground hover:text-primary-foreground hover:bg-primary hover:border-primary transition-colors duration-300 shadow-lg"
          >
            <Icon className="h-5 w-5" />
          </motion.a>
        );
      })}
    </div>
  );
};

export default FloatingContact;
