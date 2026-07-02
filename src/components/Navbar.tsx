import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, LogOut, LayoutDashboard, Search, UserCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SOULS_LOGO } from "@/lib/logos";

const navLinks = [
  { label: "Capabilities", href: "#services" },
  { label: "About Us", href: "#who-we-are" },
  { label: "Brands", href: "#brands" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-background/60 backdrop-blur-2xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1800px] mx-auto px-6 lg:px-16 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center shrink-0">
          <img
            src={SOULS_LOGO}
            alt="SOULS Media Group"
            className="h-12 md:h-14 w-auto object-contain brightness-110 hover:brightness-125 transition-all duration-300"
          />
        </Link>

        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-body font-medium tracking-[0.25em] uppercase text-muted-foreground hover:text-primary transition-colors duration-500"
            >
              {link.label}
            </a>
          ))}
          {isAdmin && (
            <Link
              to="/dashboard"
              className="text-xs font-body font-medium tracking-[0.25em] uppercase text-primary hover:text-primary/80 transition-colors duration-500 flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
            </Link>
          )}
          {session ? (
            <button
              onClick={handleSignOut}
              className="text-xs font-body font-medium tracking-[0.25em] uppercase text-muted-foreground hover:text-primary transition-colors duration-500 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          ) : (
            <Link
              to="/auth"
              className="text-xs font-body font-medium tracking-[0.25em] uppercase text-muted-foreground hover:text-primary transition-colors duration-500 flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" /> Login
            </Link>
          )}
          <a
            href="/#categories"
            className="text-xs font-body font-medium tracking-[0.15em] uppercase bg-primary text-primary-foreground px-6 py-2.5 hover:bg-primary/80 transition-all duration-300"
          >
            Start a Project
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background fixed inset-0 top-20 z-50 flex flex-col items-center justify-center"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-3xl font-display font-bold text-foreground mb-8 hover:text-primary transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="/#categories"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.1 }}
              className="text-sm font-body font-bold tracking-[0.2em] uppercase bg-primary text-primary-foreground px-8 py-3 mb-10 hover:bg-primary/80 transition-colors"
            >
              Start a Project
            </motion.a>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.1 }}
              className="flex flex-col items-center gap-6"
            >
              <Link
                to="/booking-status"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-body font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" /> Booking Status
              </Link>
              {isAdmin && (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-body uppercase tracking-[0.3em] text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              )}
              {session ? (
                <>
                  <span className="text-xs font-body uppercase tracking-[0.3em] text-muted-foreground/60 flex items-center gap-2">
                    <UserCircle className="w-4 h-4" /> {session.user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-sm font-body uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-body font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" /> Login
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
