import { motion, useInView } from "framer-motion";
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
      <div className="max-w-[1800px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left - heading */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-primary" />
              <span className="text-xs font-body font-medium tracking-[0.4em] uppercase text-primary">
                Who We Are
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase text-foreground leading-[0.95]">
              A Network
              <br />
              <span className="text-stroke">Built to</span>
              <br />
              Deliver.
            </h2>
            <div className="mt-8 inline-flex items-center gap-3 px-4 py-2 border border-border bg-card/40">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                Registered LLC
              </span>
            </div>
          </motion.div>

          {/* Right - body */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-7"
          >
            <p className="font-body text-base md:text-lg leading-relaxed text-secondary-foreground mb-6">
              SOULS Media Group is a registered LLC operating through a curated
              network of trusted creative suppliers. We assemble the right team
              for the right brief — fast, focused, and uncompromising on craft.
            </p>
            <p className="font-body text-sm md:text-base leading-relaxed text-muted-foreground mb-10">
              Every engagement is tailored. Whether you need a single specialist
              or a full production crew, our network scales to fit any
              category, budget, or creative ambition.
            </p>

            {/* Supplier grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {suppliers.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                    className="group flex items-center gap-3 p-4 border border-border bg-card/30 hover:bg-card/60 hover:border-primary/40 transition-all duration-300"
                  >
                    <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-body text-xs md:text-sm tracking-wide text-foreground">
                      {s.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="w-12 h-px bg-primary" />
              <p className="font-body text-[10px] md:text-xs tracking-[0.25em] uppercase text-muted-foreground">
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
