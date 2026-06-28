import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const services = [
  {
    number: "01",
    title: "Commercial Video",
    description: "Cinematic commercials and brand films. National campaigns. Product launches. The kind of work that wins awards and moves product.",
  },
  {
    number: "02",
    title: "Event Coverage",
    description: "Multi-camera live production with real-time editing, live streaming, and same-day highlight reels for conferences, galas, and brand activations.",
  },
  {
    number: "03",
    title: "Brand Campaigns",
    description: "End-to-end creative direction from concept through delivery. We build visual identities that make your competition irrelevant.",
  },
  {
    number: "04",
    title: "Social Content",
    description: "Platform-native content engineered to perform. Reels, TikToks, YouTube — designed for algorithms and built for humans.",
  },
  {
    number: "05",
    title: "Photography",
    description: "Editorial and commercial photography with a cinematic eye. Every frame is intentional. Every shot tells a story.",
  },
];

const ServicesSection = () => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-32 lg:py-44 border-t border-border">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-16">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-primary" />
            <span className="text-xs font-body font-medium tracking-[0.4em] uppercase text-primary">
              Capabilities
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-7xl font-extrabold uppercase text-foreground leading-none max-w-4xl">
            What We <span className="text-stroke">Bring</span> to the Table
          </h2>
        </motion.div>

        <div className="space-y-0">
          {services.map((service, i) => (
            <ServiceRow key={service.number} service={service} index={i} />
          ))}
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
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group grid grid-cols-1 md:grid-cols-12 gap-6 py-10 border-b border-border cursor-pointer hover:bg-secondary/30 transition-all duration-500 px-4 -mx-4"
    >
      <span className="md:col-span-1 font-body text-xs text-primary">
        {service.number}
      </span>
      <h3 className="md:col-span-3 font-display text-xl md:text-2xl font-bold uppercase text-foreground group-hover:text-primary transition-colors duration-500">
        {service.title}
      </h3>
      <p className="md:col-span-7 font-body text-sm leading-relaxed text-muted-foreground group-hover:text-secondary-foreground transition-colors duration-500">
        {service.description}
      </p>
      <span className="md:col-span-1 font-body text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-right text-xl">
        →
      </span>
    </motion.div>
  );
};

export default ServicesSection;
