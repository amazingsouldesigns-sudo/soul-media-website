import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-32 lg:py-52 border-t border-border relative overflow-hidden">
      {/* Giant background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-display text-[20vw] font-extrabold uppercase text-foreground/[0.03] whitespace-nowrap">
          LET'S TALK
        </span>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 lg:px-16 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-8 h-px bg-primary" />
            <span className="text-xs font-body font-medium tracking-[0.4em] uppercase text-primary">
              Next Move
            </span>
            <div className="w-8 h-px bg-primary" />
          </div>

          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-extrabold uppercase text-foreground leading-none">
            Ready to Make
            <br />
            <span className="text-stroke-accent">Something</span>{" "}
            <span className="text-primary">Real</span>?
          </h2>

          <p className="mt-10 font-body text-base text-muted-foreground max-w-lg mx-auto">
            No pitch decks. No fluff. Just tell us what you're building
            and we'll show you how to make it unforgettable.
          </p>

          <motion.a
            href="mailto:hello@soulsmedia.com"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-3 mt-14 text-sm font-body font-semibold tracking-[0.2em] uppercase bg-primary text-primary-foreground px-14 py-5 hover:bg-primary/80 transition-all duration-300 group"
          >
            Start a Project
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
