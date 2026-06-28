import { motion, useInView, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORY_REELS } from "@/lib/categoryReels";


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

  return (
    <section id="categories" className="py-32 lg:py-44 border-t border-border bg-background">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-16">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-primary" />
            <span className="text-xs font-body font-medium tracking-[0.4em] uppercase text-primary">
              Browse Work
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold uppercase text-foreground leading-none max-w-4xl">
            Choose Your <span className="text-stroke">Category</span>
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground font-body text-base md:text-lg">
            Five worlds. One studio. Pick a category to preview reels and book your project.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.slug} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const CategoryCard = ({
  category,
  index,
}: {
  category: typeof CATEGORIES[number];
  index: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const reels = CATEGORY_REELS[category.slug] ?? [];
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (reels.length <= 1) return;
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % reels.length);
    }, 5000);
    return () => clearInterval(id);
  }, [reels.length]);

  const hasReels = reels.length > 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/services/${category.slug}`}
        className="group relative block aspect-[4/5] overflow-hidden bg-card border border-border hover:border-primary transition-all duration-500"
      >
        {/* Slideshow background */}
        {hasReels ? (
          <>
            <AnimatePresence mode="sync">
              <motion.video
                key={reels[activeIdx].src}
                src={reels[activeIdx].src}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            {/* Darkening overlay for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30 group-hover:via-background/50 group-hover:to-background/10 transition-colors duration-500" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-secondary via-card to-background" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent" />
          </>
        )}

        {/* Indicator */}
        <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-[10px] font-body tracking-[0.3em] uppercase text-foreground/80">
            {hasReels ? "Live reel" : "Reels soon"}
          </span>
        </div>

        {/* Number */}
        <span className="absolute top-6 left-6 font-body text-xs text-primary tracking-widest z-10">
          {category.number}
        </span>

        {/* Slideshow progress dots */}
        {reels.length > 1 && (
          <div className="absolute top-16 right-6 flex flex-col gap-1.5 z-10">
            {reels.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                  i === activeIdx ? "bg-primary w-3" : "bg-foreground/30"
                }`}
              />
            ))}
          </div>
        )}

        {/* Bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-8 z-10">
          <h3 className="font-display text-lg sm:text-xl lg:text-3xl xl:text-4xl font-extrabold uppercase text-foreground group-hover:text-primary transition-colors duration-500 leading-[0.95]">
            {category.title}
          </h3>
          <p className="mt-2 text-xs font-body tracking-[0.2em] uppercase text-muted-foreground">
            {category.tagline}
          </p>
          <p className="mt-4 text-sm font-body text-muted-foreground/80 leading-relaxed line-clamp-2">
            {category.description}
          </p>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4 group-hover:border-primary/40 transition-colors duration-500">
            <span className="text-xs font-body font-medium tracking-[0.3em] uppercase text-foreground">
              Explore & Book
            </span>
            <span className="font-body text-primary text-xl translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </div>
        </div>

        {/* Quick action: jump straight to enquire form */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = `/services/${category.slug}#enquire`;
          }}
          className="absolute bottom-4 right-4 z-20 text-[10px] font-body font-bold tracking-[0.25em] uppercase bg-primary/90 text-primary-foreground px-3 py-2 opacity-0 group-hover:opacity-100 hover:bg-primary transition-all duration-300"
        >
          Enquire →
        </button>

        {/* Scanline */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none z-10"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent 0, transparent 2px, hsl(var(--primary) / 0.1) 2px, hsl(var(--primary) / 0.1) 3px)",
          }}
        />
      </Link>
    </motion.div>
  );
};


export default CategoriesSection;
