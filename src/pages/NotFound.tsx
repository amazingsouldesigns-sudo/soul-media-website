import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background film-grain px-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-10 h-px bg-border" />
          <span className="text-mono-label text-muted-foreground">Page not found</span>
          <div className="w-10 h-px bg-border" />
        </div>
        <h1 className="font-display text-[clamp(5rem,20vw,12rem)] font-semibold tracking-tight leading-none text-foreground">
          4<span className="text-serif-italic text-primary glow-accent">0</span>4
        </h1>
        <p className="mt-6 font-body text-base md:text-lg text-muted-foreground max-w-md mx-auto">
          This frame ended up on the cutting room floor.
        </p>
        <Link
          to="/"
          className="shiny-cta inline-flex items-center mt-10 text-xs font-semibold tracking-[0.08em] uppercase px-7 py-3.5"
        >
          <span>
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
