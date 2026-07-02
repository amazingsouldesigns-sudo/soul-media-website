import krispyKreme from "@/assets/brands/krispy-kreme.svg";
import pizzaHut from "@/assets/brands/pizza-hut.svg";
import sprite from "@/assets/brands/sprite.svg";
import redbull from "@/assets/brands/redbull.svg";

const brands = [
  { name: "Krispy Kreme", logo: krispyKreme },
  { name: "Pizza Hut", logo: pizzaHut },
  { name: "Sprite", logo: sprite },
  { name: "Red Bull", logo: redbull },
];

const BrandsSection = () => {
  // Duplicate for seamless loop
  const loop = [...brands, ...brands];

  return (
    <section id="brands" className="py-20 md:py-28 border-t border-border bg-background overflow-hidden">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-16 mb-12 md:mb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-primary" />
              <span className="text-xs font-body font-medium tracking-[0.4em] uppercase text-primary">
                Experience
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold uppercase text-foreground leading-[0.95]">
              Brands We've
              <br />
              <span className="text-stroke">Worked With</span>
            </h2>
          </div>
          <p className="font-body text-xs md:text-sm tracking-[0.2em] uppercase text-muted-foreground max-w-xs">
            Trusted by world-class names across food, beverage and lifestyle.
          </p>
        </div>
      </div>

      {/* Sliding logo bar */}
      <div className="relative">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex animate-marquee whitespace-nowrap">
          {loop.map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex-shrink-0 mx-6 md:mx-12 flex items-center justify-center h-20 md:h-28 w-32 md:w-48 group"
            >
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                loading="lazy"
                className="max-h-full max-w-full object-contain opacity-100 transition-all duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
