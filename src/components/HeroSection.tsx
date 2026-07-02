import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HERO_VIDEOS } from "@/lib/videos";

const videos = HERO_VIDEOS;

const SLIDE_DURATION = 8000; // 8 seconds per video

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
    <section className="relative h-screen w-full overflow-hidden bg-background">
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
              <div className="absolute inset-0 bg-background/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>
      ))}

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col justify-end h-full px-6 lg:px-16 pb-20 max-w-[1800px] mx-auto">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="w-12 h-px bg-primary" />
          <span className="text-xs font-body font-medium tracking-[0.4em] uppercase text-primary">
            Latest Work
          </span>
        </motion.div>

        {/* Video title — animates on change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display text-[clamp(2.5rem,8vw,7rem)] font-extrabold leading-[0.9] uppercase text-foreground">
              {videos[current].title}
            </h1>
            <p className="font-body text-sm md:text-base text-muted-foreground mt-4 tracking-wider uppercase">
              {videos[current].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Bottom bar: progress indicators + scroll CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-end justify-between mt-12 pt-8 border-t border-border"
        >
          {/* Video progress indicators */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
            {videos.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="group flex flex-col items-start gap-2 cursor-pointer"
                aria-label={`Go to video ${i + 1}`}
              >
                <span className={`text-xs font-body tracking-widest transition-colors duration-300 ${
                  i === current ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                }`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="w-8 sm:w-16 md:w-24 h-[2px] bg-border overflow-hidden rounded-full">
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

          <a
            href="#work"
            className="hidden md:flex items-center gap-3 text-xs font-body font-medium tracking-[0.2em] uppercase text-foreground group"
          >
            <span className="group-hover:text-primary transition-colors duration-300">
              Scroll to explore
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-px h-8 bg-primary"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
