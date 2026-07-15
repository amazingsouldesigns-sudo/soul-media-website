import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, LogIn, LogOut, LayoutDashboard, Search, UserCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SOULS_LOGO } from "@/lib/logos";
import TextRoll from "@/components/TextRoll";

const navLinks = [
  { label: "Capabilities", href: "#services" },
  { label: "About Us", href: "#who-we-are" },
  { label: "Brands", href: "#brands" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState<Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"]>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const checkAdmin = async (userId: string | undefined) => {
      if (!userId) { setIsAdmin(false); return; }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkAdmin(session?.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Defer Supabase call to avoid deadlock inside the callback
      setTimeout(() => checkAdmin(session?.user.id), 0);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <nav className="fixed top-4 inset-x-4 z-50 flex justify-center">
        <motion.div
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-xl"
        >
        <div
          className={`flex items-center justify-between gap-3 rounded-full border px-3 py-2 transition-all duration-500 ${
            scrolled || menuOpen
              ? "bg-background/80 border-border backdrop-blur-2xl"
              : "bg-background/50 border-border/60 backdrop-blur-xl"
          }`}
        >
          <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center shrink-0 pl-2">
            <img
              src={SOULS_LOGO}
              alt="SOULS Media Group"
              className="h-8 sm:h-9 w-auto object-contain brightness-110 hover:brightness-125 transition-all duration-300"
            />
          </Link>

          <a
            href="/#categories"
            onClick={() => setMenuOpen(false)}
            className="shiny-cta group flex items-center whitespace-nowrap text-[0.65rem] sm:text-xs font-semibold tracking-[0.08em] uppercase px-4 sm:px-5 py-2.5"
          >
            <span>
              Start a Project
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </a>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/60 hover:border-primary/60 transition-colors duration-300"
          >
            <span
              className={`absolute h-px w-4 bg-foreground transition-all duration-300 ${
                menuOpen ? "rotate-45" : "-translate-y-[3px]"
              }`}
            />
            <span
              className={`absolute h-px w-4 bg-foreground transition-all duration-300 ${
                menuOpen ? "-rotate-45" : "translate-y-[3px]"
              }`}
            />
          </button>
        </div>
        </motion.div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <span className="text-mono-label text-muted-foreground mb-10">[ MENU ]</span>
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="group roll-trigger flex items-baseline gap-4 mb-6"
              >
                <span className="text-mono-label text-muted-foreground/60 group-hover:text-primary transition-colors">
                  0{i + 1}
                </span>
                <span className="text-4xl md:text-5xl font-display font-semibold text-foreground">
                  <TextRoll text={link.label} />
                </span>
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + navLinks.length * 0.07 }}
              className="mt-10 flex flex-col items-center gap-5"
            >
              <Link
                to="/booking-status"
                onClick={() => setMenuOpen(false)}
                className="text-mono-label text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" /> Booking Status
              </Link>
              {isAdmin && (
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="text-mono-label text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              )}
              {session ? (
                <>
                  <span className="text-mono-label text-muted-foreground/60 flex items-center gap-2">
                    <UserCircle className="w-4 h-4" /> {session.user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-mono-label text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="text-mono-label text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" /> Login
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
