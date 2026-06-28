const MarqueeSection = () => {
  const text = "COMMERCIAL — EVENTS — BRAND CAMPAIGNS — SOCIAL MEDIA — PHOTOGRAPHY — CINEMATIC — ";

  return (
    <div className="py-8 border-y border-border overflow-hidden bg-background">
      <div className="animate-marquee whitespace-nowrap flex">
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="font-display text-6xl md:text-8xl font-extrabold uppercase text-foreground/[0.06] mx-4 flex-shrink-0"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeSection;
