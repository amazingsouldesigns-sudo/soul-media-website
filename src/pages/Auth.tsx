import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const routeForSession = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    navigate(data ? "/dashboard" : "/");
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setTimeout(() => routeForSession(session.user.id), 0);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) routeForSession(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast({ title: "Account created", description: "You can now sign in." });
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      toast({ title: "Authentication error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-border bg-card/40 backdrop-blur-xl p-10"
      >
        <Link to="/" className="text-mono-label text-muted-foreground hover:text-primary transition-colors">
          ← Back
        </Link>
        <h1 className="font-display text-3xl font-semibold tracking-tight mt-6 mb-2 text-foreground">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>
        <p className="text-sm text-muted-foreground mb-8 font-body">
          {mode === "signin" ? "Access your SOULS dashboard." : "Register to access the dashboard."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 w-full text-mono-label text-muted-foreground hover:text-primary transition-colors"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </motion.div>
    </div>
  );
};

export default Auth;
