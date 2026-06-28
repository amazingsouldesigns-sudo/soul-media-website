import { useEffect, useRef, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, MessageCircle, Calendar, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import { CATEGORIES } from "@/components/CategoriesSection";
import { CONTACT, buildWhatsAppUrl, buildMailtoUrl } from "@/lib/contact";
import { CATEGORY_REELS } from "@/lib/categoryReels";
import krispyKreme from "@/assets/brands/krispy-kreme.svg.asset.json";
import pizzaHut from "@/assets/brands/pizza-hut.svg.asset.json";
import sprite from "@/assets/brands/sprite.svg.asset.json";
import redbull from "@/assets/brands/redbull.svg.asset.json";

const TRUST_LOGOS = [krispyKreme.url, pizzaHut.url, sprite.url, redbull.url];

const TRUST_QUOTES: Record<string, { quote: string; attribution: string }> = {
  ads: { quote: "They turned our launch into appointment viewing.", attribution: "Brand Marketing Lead, F&B" },
  entertainment: { quote: "Cinematic — exactly the energy the record needed.", attribution: "Independent Artist" },
  corporate: { quote: "The kind of film our exec team actually wants to share.", attribution: "Head of Comms" },
  weddings: { quote: "We've watched the film a hundred times and still cry.", attribution: "Newlywed Client" },
  lifestyle: { quote: "Hit every spec, then handed us extras we didn't ask for.", attribution: "Social Director" },
};

const OVERVIEWS: Record<string, { hero: string; body: string; bullets: string[] }> = {
  ads: {
    hero: "Commercials engineered to convert",
    body: "We build commercial work that earns attention and moves product. From single-spot brand films to multi-platform campaign suites, every frame is purposeful.",
    bullets: [
      "Concept, script, and storyboard",
      "Director-led production crews",
      "Color, sound design, and finishing in-house",
      "Cutdowns for TV, social, and OOH",
    ],
  },
  entertainment: {
    hero: "For artists, labels, and creators",
    body: "Music videos, performance films, artist documentaries, and creator-economy content built with editorial precision and visual ambition.",
    bullets: [
      "Music video direction & production",
      "Tour, performance, and BTS coverage",
      "Artist photography",
      "Short-form social rollout assets",
    ],
  },
  corporate: {
    hero: "Corporate without looking corporate",
    body: "Brand films, executive interviews, recruitment videos, and conference recaps that elevate your organisation without slipping into stock-footage mediocrity.",
    bullets: [
      "Brand & culture films",
      "Executive interviews and case studies",
      "Conference and event coverage",
      "Internal comms and training video",
    ],
  },
  weddings: {
    hero: "Cinematic love stories, told properly",
    body: "Documentary-meets-cinema wedding films and full-day photo coverage. We shoot the day as it unfolds — no posed cheese, no formula.",
    bullets: [
      "Full-day cinematic coverage",
      "Same-day social teaser (optional)",
      "Highlight film + full ceremony edit",
      "Photo + video crew packages",
    ],
  },
  lifestyle: {
    hero: "Editorial energy, social-first delivery",
    body: "Lifestyle shoots, brand photography, social-native reels, and influencer collaborations. Built for feeds, formatted for performance.",
    bullets: [
      "Lifestyle and editorial photography",
      "Reels, TikTok, and YouTube Shorts",
      "Influencer & talent collaborations",
      "Content packages with month-long usage",
    ],
  },
};

const HOW_IT_WORKS = [
  { step: "01", title: "Tell us about the project", body: "Three quick steps in the form below — should take under two minutes." },
  { step: "02", title: "Tailored quote in 24h", body: "We come back with scope, crew, and pricing built around your brief." },
  { step: "03", title: "Confirm and shoot", body: "You confirm, we plan, the team shows up ready. Edits delivered on schedule." },
];

/**
 * LazyReelVideo — mounts the <video> element only when scrolled near the viewport.
 * Pauses when offscreen to save CPU and mobile data.
 */
const LazyReelVideo = ({ src, label }: { src: string; label: string }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { rootMargin: "200px 0px", threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isVisible) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isVisible, shouldLoad]);

  return (
    <div
      ref={wrapRef}
      className="relative aspect-video bg-card border border-border overflow-hidden group"
    >
      {shouldLoad ? (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          controls
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-transparent" />
      )}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent pointer-events-none">
        <p className="text-xs font-body tracking-[0.3em] uppercase text-foreground">{label}</p>
      </div>
    </div>
  );
};

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = CATEGORIES.find((c) => c.slug === slug);
  const reels = category ? CATEGORY_REELS[category.slug] ?? [] : [];

  useEffect(() => {
    if (category) {
      document.title = `${category.title} — SOULS Media Group`;
      const desc = document.querySelector('meta[name="description"]');
      if (desc) {
        desc.setAttribute(
          "content",
          `${category.title} production by SOULS Media Group. ${category.tagline}. Book your project.`
        );
      }
      // If URL has a hash (e.g. #enquire), let the browser handle it; otherwise scroll to top.
      if (!window.location.hash) window.scrollTo(0, 0);
    }
  }, [category]);

  // Smooth-scroll to #enquire if the hash is present on load
  useEffect(() => {
    if (window.location.hash === "#enquire") {
      setTimeout(() => {
        document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [slug]);

  if (!category) return <Navigate to="/" replace />;

  const overview = OVERVIEWS[category.slug];
  const quote = TRUST_QUOTES[category.slug];
  const waMessage = `Hi SOULS Media Group, I'd like to enquire about a ${category.title} project.`;
  const emailSubject = `${category.title} enquiry — SOULS Media Group`;

  return (
    <div className="min-h-screen bg-background film-grain">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 border-b border-border">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-16">
          <Link
            to="/#categories"
            className="inline-flex items-center gap-2 text-xs font-body tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300 mb-12"
          >
            <ArrowLeft className="w-3 h-3" /> All categories
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-primary" />
              <span className="text-xs font-body font-medium tracking-[0.4em] uppercase text-primary">
                {category.number} — {category.tagline}
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold uppercase text-foreground leading-[0.95] break-words [word-break:break-word]">
              {category.title}
            </h1>
            <p className="mt-8 text-lg md:text-2xl font-body text-muted-foreground max-w-3xl leading-relaxed">
              {overview.hero}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#enquire"
                className="inline-flex items-center gap-2 text-xs font-body font-bold tracking-[0.25em] uppercase bg-primary text-primary-foreground px-7 py-3 hover:bg-primary/80 transition-all duration-300"
              >
                Start your enquiry →
              </a>
              <a
                href="#reels"
                className="inline-flex items-center gap-2 text-xs font-body font-medium tracking-[0.25em] uppercase border border-border text-foreground px-7 py-3 hover:border-primary hover:text-primary transition-all duration-300"
              >
                View reels
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reels */}
      <section id="reels" className="py-20 lg:py-28 border-b border-border">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-px bg-primary" />
            <span className="text-xs font-body font-medium tracking-[0.4em] uppercase text-primary">
              Featured Reels
            </span>
          </div>

          {(() => {
            const placeholders = Math.max(0, 3 - reels.length);
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reels.map((reel, i) => (
                  <LazyReelVideo key={`reel-${i}`} src={reel.src} label={reel.label} />
                ))}
                {Array.from({ length: placeholders }).map((_, i) => (
                  <div
                    key={`ph-${i}`}
                    className="relative aspect-video bg-card border border-border overflow-hidden flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-transparent" />
                    <div className="relative z-10 text-center p-6">
                      <span className="relative inline-flex h-2 w-2 mb-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                      </span>
                      <p className="text-xs font-body tracking-[0.3em] uppercase text-muted-foreground">
                        Reel {String(reels.length + i + 1).padStart(2, "0")} — coming soon
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* Social proof */}
      <section className="py-16 lg:py-20 border-b border-border bg-card/30">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-primary" />
              <span className="text-xs font-body font-medium tracking-[0.4em] uppercase text-primary">
                Trusted by
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center mt-6">
              {TRUST_LOGOS.map((logo, i) => (
                <img
                  key={i}
                  src={logo}
                  alt="Client brand"
                  loading="lazy"
                  className="max-h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-500"
                />
              ))}
            </div>
          </div>
          {quote && (
            <blockquote className="lg:col-span-7 lg:border-l lg:border-border lg:pl-12">
              <p className="font-display text-2xl md:text-3xl font-bold text-foreground leading-snug">
                "{quote.quote}"
              </p>
              <footer className="mt-4 text-xs font-body tracking-[0.3em] uppercase text-muted-foreground">
                — {quote.attribution}
              </footer>
            </blockquote>
          )}
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 lg:py-28 border-b border-border">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-primary" />
              <span className="text-xs font-body font-medium tracking-[0.4em] uppercase text-primary">
                What we do
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold uppercase text-foreground leading-tight">
              Built around your brief
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-base md:text-lg font-body text-muted-foreground leading-relaxed mb-8">
              {overview.body}
            </p>
            <ul className="space-y-3">
              {overview.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm md:text-base font-body text-foreground">
                  <span className="text-primary mt-1">→</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 lg:py-24 border-b border-border bg-card/30">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-16">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-8 h-px bg-primary" />
            <span className="text-xs font-body font-medium tracking-[0.4em] uppercase text-primary">
              How it works
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="border border-border p-8 bg-background relative">
                <CheckCircle2 className="absolute top-6 right-6 w-5 h-5 text-primary/40" />
                <span className="font-body text-xs tracking-[0.4em] text-primary">{s.step}</span>
                <h3 className="font-display text-xl md:text-2xl font-bold text-foreground uppercase mt-3 mb-2 leading-tight">
                  {s.title}
                </h3>
                <p className="text-sm font-body text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking form */}
      <section id="enquire" className="py-20 lg:py-28 border-b border-border scroll-mt-24">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-primary" />
              <span className="text-xs font-body font-medium tracking-[0.4em] uppercase text-primary">
                Book / Enquire
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl xl:text-5xl font-extrabold uppercase text-foreground leading-[1.05] break-words [word-break:break-word] mb-6">
              Start your {category.title.toLowerCase()} project
            </h2>
            <p className="text-sm font-body text-muted-foreground leading-relaxed">
              Tell us what you're building. We'll come back within 24 hours with a scope and quote.
            </p>
          </div>
          <div className="lg:col-span-8">
            <BookingForm category={category.slug} categoryLabel={category.title} />
          </div>
        </div>
      </section>

      {/* Conversion options */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-px bg-primary" />
            <span className="text-xs font-body font-medium tracking-[0.4em] uppercase text-primary">
              Or reach out directly
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ContactCard
              icon={<MessageCircle className="w-5 h-5" />}
              label="WhatsApp chat"
              value={CONTACT.whatsappDisplay}
              href={buildWhatsAppUrl(waMessage)}
            />
            <ContactCard
              icon={<Mail className="w-5 h-5" />}
              label="Email enquiry"
              value={CONTACT.email}
              href={buildMailtoUrl(emailSubject, waMessage)}
            />
            <ContactCard
              icon={<Calendar className="w-5 h-5" />}
              label="Schedule a call"
              value={CONTACT.scheduleUrl ? "Book a 30-min slot" : "Coming soon"}
              href={CONTACT.scheduleUrl || undefined}
              disabled={!CONTACT.scheduleUrl}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const ContactCard = ({
  icon,
  label,
  value,
  href,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  disabled?: boolean;
}) => {
  const content = (
    <div
      className={`group h-full border border-border bg-card p-8 transition-all duration-500 ${
        disabled ? "opacity-50" : "hover:border-primary hover:bg-primary/5 cursor-pointer"
      }`}
    >
      <div className="flex items-center gap-3 text-primary mb-6">
        {icon}
        <span className="text-xs font-body font-medium tracking-[0.3em] uppercase">{label}</span>
      </div>
      <div className="font-display text-lg lg:text-xl font-bold uppercase text-foreground group-hover:text-primary transition-colors duration-300 break-all leading-tight">
        {value}
      </div>
    </div>
  );

  if (disabled || !href) return content;

  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
      {content}
    </a>
  );
};

export default CategoryPage;
