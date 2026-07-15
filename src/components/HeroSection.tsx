import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HERO_VIDEOS } from "@/lib/videos";

const videos = HERO_VIDEOS;

const SLIDE_DURATION = 8000; // 8 seconds per video

const stats = [
  { value: "150+", label: "Projects delivered" },
  { value: "40+", label: "Brands served" },
  { value: "8yr", label: "Of craft" },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(Date.now());

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % videos.length);
  }, [current, goTo]);

  // Auto-advance timer with progress
  useEffect(() => {
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min(elapsed / SLIDE_DURATION, 1);
      setProgress(p);
      if (p >= 1) {
        next();
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, next]);

  // Play the active video, pause others
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === current) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [current]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Video layers */}
      {videos.map((video, i) => (
        <AnimatePresence key={i}>
          {i === current && (
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <video
                ref={(el) => { videoRefs.current[i] = el; }}
                src={video.src}
                muted
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-background/60" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
            </motion.div>
          )}
        </AnimatePresence>
      ))}

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col justify-end min-h-screen px-6 lg:px-16 pb-16 pt-36 max-w-[1400px] mx-auto">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-10 h-px bg-border" />
          <span className="text-mono-label text-muted-foreground">
            [01] &nbsp;Premium video production
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(2.75rem,7vw,6.5rem)] font-semibold leading-[1.02] tracking-tight text-foreground max-w-5xl"
        >
          We craft <span className="text-serif-italic text-primary glow-accent">stories</span>
          <br />
          for ambitious brands.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="font-body text-base md:text-lg text-muted-foreground mt-6 max-w-xl leading-relaxed"
        >
          Commercials, films and social-first content. Strategy, production
          and post from one curated network.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap items-center gap-8 mt-10"
        >
          <a
            href="#categories"
            className="shiny-cta group flex items-center text-sm font-semibold tracking-[0.06em] uppercase px-7 py-4"
          >
            <span>
              Start a project
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </a>
          <a
            href="#work"
            className="text-mono-label text-muted-foreground hover:text-primary transition-colors duration-300 underline-offset-8 hover:underline"
          >
            Selected work ↓
          </a>
        </motion.div>

        {/* Bottom bar: stats + video switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-wrap items-end justify-between gap-8 mt-16 pt-8 border-t border-border/70"
        >
          {/* Stats */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  {stat.value}
                </span>
                <span className="text-mono-label text-muted-foreground/80 text-[0.65rem]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Video progress indicators */}
          <div className="flex flex-col items-start gap-3">
            <AnimatePresence mode="wait">
              <motion.span
                key={current}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="text-mono-label text-muted-foreground"
              >
                {videos[current].title} · {videos[current].subtitle}
              </motion.span>
            </AnimatePresence>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {videos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="group flex flex-col items-start gap-2 cursor-pointer"
                  aria-label={`Go to video ${i + 1}`}
                >
                  <span
                    className={`font-mono text-[0.65rem] tracking-widest transition-colors duration-300 ${
                      i === current ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="w-8 sm:w-12 md:w-16 h-[2px] bg-border overflow-hidden rounded-full">
                    <div
                      className="h-full bg-primary transition-none"
                      style={{
                        width: i === current ? `${progress * 100}%` : i < current ? "100%" : "0%",
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
