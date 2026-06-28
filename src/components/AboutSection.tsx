import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "150+", label: "Projects" },
  { value: "40+", label: "Brands" },
  { value: "8yr", label: "Craft" },
  { value: "∞", label: "Vision" },
];

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-32 lg:py-44 border-t border-border">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
          {/* Left - big statement */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-primary" />
              <span className="text-xs font-body font-medium tracking-[0.4em] uppercase text-primary">
                The Studio
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold uppercase text-foreground leading-[0.95]">
              We Don't Do
              <br />
              <span className="text-stroke">Average</span>.
            </h2>

            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-4 mt-16 pt-10 border-t border-border">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl md:text-3xl font-extrabold text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-1 font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - text */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <p className="font-body text-lg leading-relaxed text-secondary-foreground mb-8">
              SOULS Media Group exists at the intersection of cinema and commerce.
              We're not a generic video shop — we're a creative weapon for brands
              that understand the power of visual storytelling.
            </p>
            <p className="font-body text-sm leading-relaxed text-muted-foreground mb-10">
              From Fortune 500 boardrooms to underground music venues, we bring
              the same obsessive attention to craft. Every frame is deliberate.
              Every cut is intentional. Every project is a chance to make
              something that didn't exist before.
            </p>
            <div className="flex items-center gap-6">
              <div className="w-16 h-px bg-primary" />
              <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground">
                Based in the culture. Built for the future.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
