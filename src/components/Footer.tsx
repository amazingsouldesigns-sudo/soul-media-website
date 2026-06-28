import logoAsset from "@/assets/souls-logo.png.asset.json";

const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-16 py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center font-display text-lg font-extrabold uppercase text-foreground">
              <img
                src={logoAsset.url}
                alt="SOULS"
                className="h-[4.5rem] w-auto object-contain brightness-110 hover:brightness-125 transition-all duration-300"
              />
            </div>
            <p className="mt-1 font-body text-xs tracking-[0.2em] uppercase text-muted-foreground">
              Media Group
            </p>
          </div>

          <div className="flex flex-wrap gap-10">
            {["Instagram", "Vimeo", "LinkedIn", "YouTube"].map((platform) => (
              <a
                key={platform}
                href="#"
                className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                {platform}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50">
            © 2026 SOULS Media Group. All rights reserved.
          </p>
          <p className="font-body text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50">
            Crafted with obsession
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
