import { motion, useInView } from "framer-motion";
import RevealHeading from "@/components/RevealHeading";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useCategory } from "@/context/CategoryContext";

const ContactSection = () => {
  const { projectHref } = useCategory();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-24 md:py-32 lg:py-52 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-display text-[20vw] font-semibold tracking-tight uppercase text-foreground/[0.03] whitespace-nowrap">
          LET'S TALK
        </span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-10 h-px bg-border" />
            <span className="text-mono-label text-muted-foreground">
              [07] &nbsp;Next move
            </span>
            <div className="w-10 h-px bg-border" />
          </div>

          <RevealHeading className="font-display text-[clamp(2.75rem,7vw,6.5rem)] font-semibold tracking-tight text-foreground leading-[1.02]">
            Ready to make
            <br />
            something <span className="text-serif-italic text-primary glow-accent">real</span>?
          </RevealHeading>

          <p className="mt-10 font-body text-base text-muted-foreground max-w-lg mx-auto">
            No pitch decks. No fluff. Just tell us what you're building
            and we'll show you how to make it unforgettable.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              to={projectHref}
              className="shiny-cta inline-flex items-center mt-14 text-sm font-body font-semibold tracking-[0.08em] uppercase px-12 py-5 group"
            >
              <span>
                Start a Project
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
