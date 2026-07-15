import { motion, useInView } from "framer-motion";
import RevealHeading from "@/components/RevealHeading";
import { useRef } from "react";
import { Camera, Video, Palette, Code2, Megaphone, Building2, Smartphone } from "lucide-react";

const suppliers = [
  { icon: Camera, label: "Photographers" },
  { icon: Video, label: "Videographers" },
  { icon: Palette, label: "Graphic Designers" },
  { icon: Code2, label: "Web Developers" },
  { icon: Smartphone, label: "App Developers" },
  { icon: Megaphone, label: "Marketing Specialists" },
];

const WhoWeAreSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="who-we-are" className="py-24 md:py-32 lg:py-44 border-t border-border">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left - heading */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-px bg-border" />
              <span className="text-mono-label text-muted-foreground">
                [02] &nbsp;Who we are
              </span>
            </div>
            <RevealHeading className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-semibold tracking-tight text-foreground leading-[1.05]">
              A network built
              <br />
              to <span className="text-serif-italic text-primary">deliver</span>.
            </RevealHeading>
            <div className="mt-8 inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-border bg-card/40">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-mono-label text-muted-foreground text-[0.65rem]">
                Registered LLC
              </span>
            </div>
          </motion.div>

          {/* Right - body */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <p className="font-body text-base md:text-lg leading-relaxed text-secondary-foreground mb-6">
              SOULS Media Group is a registered LLC operating through a curated
              network of trusted creative suppliers. We assemble the right team
              for the right brief: fast, focused, and uncompromising on craft.
            </p>
            <p className="font-body text-sm md:text-base leading-relaxed text-muted-foreground mb-10">
              Every engagement is tailored. Whether you need a single specialist
              or a full production crew, our network scales to fit any
              category, budget, or creative ambition.
            </p>

            {/* Supplier grid */}
            <div className="flex flex-wrap gap-3">
              {suppliers.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                    className="group flex items-center gap-3 px-5 py-3 rounded-full border border-border bg-card/30 hover:bg-card/60 hover:border-primary/50 transition-all duration-300"
                  >
                    <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-mono-label text-foreground/90 text-[0.65rem]">
                      {s.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="w-12 h-px bg-primary" />
              <p className="text-mono-label text-muted-foreground text-[0.65rem]">
                Tailored to any specialised category or client need.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreSection;
