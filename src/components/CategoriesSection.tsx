import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORY_REELS } from "@/lib/categoryReels";
import TextRoll from "@/components/TextRoll";
import RevealHeading from "@/components/RevealHeading";

export const CATEGORIES = [
  {
    slug: "ads",
    number: "01",
    title: "Ads",
    tagline: "Commercials that move product",
    description: "Cinematic commercials, brand spots, and product launches built to convert.",
  },
  {
    slug: "entertainment",
    number: "02",
    title: "Entertainment",
    tagline: "Music, film & creators",
    description: "Music videos, artist content, short films, and editorial-grade creator work.",
  },
  {
    slug: "corporate",
    number: "03",
    title: "Corporate",
    tagline: "Brand films & internal comms",
    description: "Polished corporate films, executive interviews, conference recaps, and brand storytelling.",
  },
  {
    slug: "weddings",
    number: "04",
    title: "Weddings",
    tagline: "Cinematic love stories",
    description: "Documentary-meets-cinema wedding films and full-day photo coverage.",
  },
  {
    slug: "lifestyle",
    number: "05",
    title: "Lifestyle",
    tagline: "Editorial & social-first",
    description: "Lifestyle shoots, social-native reels, and influencer collaborations.",
  },
] as const;

const CategoriesSection = () => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" });
  const [hovered, setHovered] = useState<string | null>(null);

  // Cursor-following preview position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 200, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 25 });

  const onMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const hoveredReels = hovered ? CATEGORY_REELS[hovered] ?? [] : [];

  return (
    <section id="categories" className="relative py-24 md:py-32 lg:py-44 border-t border-border bg-background">
      <div id="work" className="absolute -top-24" aria-hidden="true" />
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
              [03] &nbsp;Selected work / Browse categories
            </span>
          </div>
          <RevealHeading className="font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold tracking-tight text-foreground leading-[1.05]">
            Choose your <span className="text-serif-italic text-primary">world</span>.
          </RevealHeading>
          <p className="mt-6 max-w-xl text-muted-foreground font-body text-base md:text-lg leading-relaxed">
            Five worlds. One studio. Pick a category to preview reels and book your project.
          </p>
        </motion.div>

        {/* Numbered work list */}
        <div onMouseMove={onMouseMove} onMouseLeave={() => setHovered(null)}>
          {CATEGORIES.map((cat, i) => (
            <WorkRow
              key={cat.slug}
              category={cat}
              index={i}
              hovered={hovered === cat.slug}
              anyHovered={hovered !== null}
              onHover={(h) => setHovered(h ? cat.slug : null)}
            />
          ))}
          <div className="border-t border-border" />
        </div>
      </div>

      {/* Cursor-following video preview (desktop only) */}
      <AnimatePresence>
        {hovered && hoveredReels.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ left: springX, top: springY, x: "-50%", y: "-110%" }}
            className="pointer-events-none fixed z-40 hidden md:block w-[22rem] aspect-video overflow-hidden rounded-2xl border border-border shadow-2xl shadow-primary/10"
          >
            <video
              key={hoveredReels[0].src}
              src={hoveredReels[0].src}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const WorkRow = ({
  category,
  index,
  hovered,
  anyHovered,
  onHover,
}: {
  category: typeof CATEGORIES[number];
  index: number;
  hovered: boolean;
  anyHovered: boolean;
  onHover: (hovering: boolean) => void;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const hasReels = (CATEGORY_REELS[category.slug] ?? []).length > 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/services/${category.slug}`}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        className={`group roll-trigger relative grid grid-cols-[2.5rem_1fr_auto] lg:grid-cols-[4rem_1fr_16rem_7rem_3rem] items-center gap-4 lg:gap-8 border-t border-border py-8 lg:py-10 transition-opacity duration-300 ${
          anyHovered && !hovered ? "opacity-35" : "opacity-100"
        }`}
      >
        <span
          className={`font-mono text-sm transition-colors duration-300 ${
            hovered ? "text-primary" : "text-muted-foreground/60"
          }`}
        >
          {category.number}
        </span>

        <div className="min-w-0">
          <h3
            className={`font-display text-[clamp(1.75rem,4vw,3.25rem)] font-semibold tracking-tight leading-none text-foreground transition-transform duration-300 ${
              hovered ? "translate-x-2" : ""
            }`}
          >
            <TextRoll text={category.title} />
          </h3>
          <p className="lg:hidden mt-2 text-mono-label text-muted-foreground/80 text-[0.65rem]">
            {category.tagline}
          </p>
        </div>

        <span className="hidden lg:block text-mono-label text-muted-foreground text-[0.68rem]">
          {category.tagline}
        </span>

        <span className="hidden lg:flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            {hasReels && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${hasReels ? "bg-primary" : "bg-muted-foreground/40"}`} />
          </span>
          <span className="text-mono-label text-muted-foreground/70 text-[0.6rem]">
            {hasReels ? "Live reel" : "Soon"}
          </span>
        </span>

        <span
          className={`justify-self-end font-body text-2xl transition-all duration-300 ${
            hovered ? "text-primary -translate-y-1 translate-x-1" : "text-muted-foreground/50"
          }`}
        >
          ↗
        </span>
      </Link>
    </motion.div>
  );
};

export default CategoriesSection;
