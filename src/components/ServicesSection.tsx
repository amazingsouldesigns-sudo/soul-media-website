import { motion, useInView } from "framer-motion";
import RevealHeading from "@/components/RevealHeading";
import { useRef } from "react";

const services = [
  {
    number: "01",
    title: "Commercial Video",
    description: "Cinematic commercials and brand films. National campaigns. Product launches. The kind of work that wins awards and moves product.",
    tags: ["Brand films", "Campaigns", "Product launches"],
  },
  {
    number: "02",
    title: "Event Coverage",
    description: "Multi-camera live production with real-time editing, live streaming, and same-day highlight reels for conferences, galas, and brand activations.",
    tags: ["Multi-cam", "Live streaming", "Same-day edits"],
  },
  {
    number: "03",
    title: "Brand Campaigns",
    description: "End-to-end creative direction from concept through delivery. We build visual identities that make your competition irrelevant.",
    tags: ["Creative direction", "Visual identity", "Concept to delivery"],
  },
  {
    number: "04",
    title: "Social Content",
    description: "Platform-native content engineered to perform. Reels, TikToks, YouTube. Designed for algorithms and built for humans.",
    tags: ["Reels & TikTok", "YouTube", "Platform-native"],
  },
  {
    number: "05",
    title: "Photography",
    description: "Editorial and commercial photography with a cinematic eye. Every frame is intentional. Every shot tells a story.",
    tags: ["Editorial", "Commercial", "Cinematic stills"],
  },
];

const ServicesSection = () => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-24 md:py-32 lg:py-44 border-t border-border">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 lg:mb-20"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-px bg-border" />
            <span className="text-mono-label text-muted-foreground">
              [04] &nbsp;Capabilities / What we do
            </span>
          </div>
          <RevealHeading className="font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold tracking-tight text-foreground leading-[1.05] max-w-4xl">
            Five disciplines.
            <br />
            One <span className="text-serif-italic text-primary">team</span>.
          </RevealHeading>
        </motion.div>

        <div className="space-y-0">
          {services.map((service, i) => (
            <ServiceRow key={service.number} service={service} index={i} />
          ))}
          <div className="border-t border-border" />
        </div>
      </div>
    </section>
  );
};

const ServiceRow = ({ service, index }: { service: typeof services[0]; index: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 py-10 lg:py-12 border-t border-border transition-colors duration-500"
    >
      <span className="md:col-span-1 font-mono text-sm text-muted-foreground/60 group-hover:text-primary transition-colors duration-300">
        {service.number}
      </span>
      <div className="md:col-span-4">
        <h3 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors duration-500">
          {service.title}
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {service.tags.map((tag) => (
            <span
              key={tag}
              className="text-mono-label text-[0.6rem] text-muted-foreground border border-border rounded-full px-3 py-1.5 group-hover:border-primary/40 transition-colors duration-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <p className="md:col-span-6 font-body text-sm md:text-base leading-relaxed text-muted-foreground group-hover:text-secondary-foreground transition-colors duration-500">
        {service.description}
      </p>
      <span className="md:col-span-1 font-body text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-right text-2xl">
        →
      </span>
    </motion.div>
  );
};

export default ServicesSection;
