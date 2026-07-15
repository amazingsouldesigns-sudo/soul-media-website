import { SOULS_LOGO } from "@/lib/logos";

const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center">
            <img
              src={SOULS_LOGO}
              alt="SOULS Media Group"
              className="h-[4.5rem] w-auto object-contain brightness-110 hover:brightness-125 transition-all duration-300"
            />
          </div>

          <div className="flex flex-wrap gap-10">
            {/* TODO: replace "#" with real profile URLs */}
            {["Instagram", "Vimeo", "LinkedIn", "YouTube"].map((platform) => (
              <a
                key={platform}
                href="#"
                className="text-mono-label text-muted-foreground hover:text-primary transition-colors duration-300 text-[0.65rem]"
              >
                {platform}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-mono-label text-[0.6rem] text-muted-foreground/50">
            © 2026 SOULS Media Group. All rights reserved.
          </p>
          <p className="text-mono-label text-[0.6rem] text-muted-foreground/50">
            Crafted with obsession
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
