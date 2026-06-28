import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Search, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoAsset from "@/assets/soul_logo_copy.png.asset.json";

interface BookingRow {
  id: string;
  category: string;
  project_type: string;
  preferred_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const statusStyles: Record<string, string> = {
  confirmed: "border-primary text-primary",
  in_review: "border-yellow-500/50 text-yellow-500",
  declined: "border-red-500/50 text-red-500",
  new: "border-border text-muted-foreground",
};

const statusCopy: Record<string, string> = {
  confirmed: "Your booking is confirmed — we'll be in touch with next steps.",
  in_review: "Your booking is currently being reviewed by our team.",
  declined: "Unfortunately this booking could not be accepted.",
  new: "Received. Sitting in the queue for review.",
};

const BookingStatus = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BookingRow[] | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const { data, error } = await supabase.rpc("get_my_bookings", {
      _email: email.trim(),
    });
    setLoading(false);
    if (error) {
      toast({ title: "Lookup failed", description: error.message, variant: "destructive" });
      return;
    }
    setResults((data ?? []) as BookingRow[]);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1 font-display text-lg font-extrabold uppercase text-foreground">
            <img 
              src={logoAsset.url} 
              alt="S" 
              className="h-8 w-auto object-contain inline-block mr-1 brightness-110 hover:brightness-125 transition-all duration-300" 
            />
            <span className="tracking-[0.25em]">OULS</span><span className="text-primary font-bold">.</span>
          </Link>
          <Link to="/" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center gap-2">
            <ArrowLeft className="w-3 h-3" /> Home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3">Booking Status</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            Check your booking
          </h1>
          <p className="text-muted-foreground font-body mb-10">
            Enter the email you used when submitting your enquiry.
          </p>
        </motion.div>

        <Card className="p-6 bg-card/40 backdrop-blur border-border mb-8">
          <form onSubmit={handleLookup} className="flex flex-col md:flex-row gap-3 md:items-end">
            <div className="flex-1">
              <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                placeholder="you@example.com"
                required
                className="mt-2"
              />
            </div>
            <Button type="submit" disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              {loading ? "Searching..." : "Look up"}
            </Button>
          </form>
        </Card>

        {results !== null && (
          <div className="space-y-4">
            {results.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground border-border bg-card/40">
                No bookings found for that email.
              </Card>
            ) : (
              results.map((b) => (
                <Card key={b.id} className="p-6 bg-card/40 backdrop-blur border-border">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-primary">{b.category}</p>
                      <h2 className="font-display text-xl font-semibold text-foreground mt-1">
                        {b.project_type}
                      </h2>
                    </div>
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 border ${
                      statusStyles[b.status] ?? statusStyles.new
                    }`}>
                      {b.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {statusCopy[b.status] ?? statusCopy.new}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    {b.preferred_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(b.preferred_date).toLocaleDateString()}
                      </span>
                    )}
                    <span>Submitted {new Date(b.created_at).toLocaleDateString()}</span>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingStatus;
