import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import logoAsset from "@/assets/soul_logo_copy.png.asset.json";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Mail, Phone, Calendar, Users, Clock, ChevronDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";


type Enquiry = Tables<"booking_enquiries">;

const STATUS_OPTIONS = ["new", "in_review", "confirmed", "declined"] as const;
type Status = typeof STATUS_OPTIONS[number];

const statusStyles: Record<string, string> = {
  confirmed: "border-primary text-primary",
  in_review: "border-yellow-500/50 text-yellow-500",
  declined: "border-red-500/50 text-red-500",
  new: "border-border text-muted-foreground",
};

const EXAMPLE_CLIENTS: Enquiry[] = [
  {
    id: "example-1",
    name: "Campari Group",
    email: "events@campari.com",
    phone: "+1 212 555 0144",
    category: "corporate",
    project_type: "Brand Activation Film",
    hours_required: "12",
    num_shooters: "3",
    deliverables: ["4K Recap", "Social Cutdowns", "BTS"],
    additional_requirements: "Drone coverage + on-site editor.",
    preferred_date: "2026-08-14",
    status: "confirmed",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    budget_range: "$10k+",
    attachment_urls: null,
  },
  {
    id: "example-2",
    name: "Krispy Kreme",
    email: "marketing@krispykreme.com",
    phone: "+1 336 555 0199",
    category: "corporate",
    project_type: "Store Opening Coverage",
    hours_required: "8",
    num_shooters: "2",
    deliverables: ["Hero Film", "Reels"],
    additional_requirements: null,
    preferred_date: "2026-07-22",
    status: "new",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    budget_range: "$5k–$10k",
    attachment_urls: null,
  },
  {
    id: "example-3",
    name: "Maxine Rivera",
    email: "maxine@kcbw.com",
    phone: "+1 305 555 0123",
    category: "lifestyle",
    project_type: "Lifestyle Campaign",
    hours_required: "16",
    num_shooters: "2",
    deliverables: ["Director's Cut", "Stills"],
    additional_requirements: "Two-day shoot, Miami location.",
    preferred_date: "2026-09-03",
    status: "in_review",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date().toISOString(),
    budget_range: "$10k+",
    attachment_urls: null,
  },
  {
    id: "example-4",
    name: "Elena & Marcus",
    email: "elena.weds@gmail.com",
    phone: "+1 415 555 0177",
    category: "weddings",
    project_type: "Wedding Film",
    hours_required: "10",
    num_shooters: "2",
    deliverables: ["Cinematic Film", "Highlight Reel"],
    additional_requirements: "Sunset ceremony, Napa Valley.",
    preferred_date: "2026-10-12",
    status: "new",
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    updated_at: new Date().toISOString(),
    budget_range: "$2k–$5k",
    attachment_urls: null,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [userEmail, setUserEmail] = useState("Preview Mode");

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUserEmail(session.user.email ?? "");

      const { data } = await supabase
        .from("booking_enquiries")
        .select("*")
        .order("created_at", { ascending: false });
      setEnquiries([...(data ?? []), ...EXAMPLE_CLIENTS]);
      setLoading(false);
    };
    init();
  }, [navigate]);


  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const updateStatus = async (enquiry: Enquiry, status: Status) => {
    const prev = enquiry.status;
    // optimistic
    setEnquiries((list) =>
      list.map((e) => (e.id === enquiry.id ? { ...e, status } : e)),
    );

    if (enquiry.id.startsWith("example-")) {
      toast({ title: "Status updated", description: `${enquiry.name} → ${status.replace("_", " ")}` });
      return;
    }

    const { error } = await supabase
      .from("booking_enquiries")
      .update({ status })
      .eq("id", enquiry.id);

    if (error) {
      setEnquiries((list) =>
        list.map((e) => (e.id === enquiry.id ? { ...e, status: prev } : e)),
      );
      toast({
        title: "Couldn't update",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Status updated", description: `${enquiry.name} → ${status.replace("_", " ")}` });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground font-body tracking-widest text-xs uppercase">
        Loading dashboard...
      </div>
    );
  }


  const stats = {
    total: enquiries.length,
    newCount: enquiries.filter((e) => e.status === "new").length,
    inReview: enquiries.filter((e) => e.status === "in_review").length,
    confirmed: enquiries.filter((e) => e.status === "confirmed").length,
    declined: enquiries.filter((e) => e.status === "declined").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <div>
            <Link to="/" className="flex items-center gap-1 font-display text-lg font-extrabold uppercase text-foreground">
              <img 
                src={logoAsset.url} 
                alt="S" 
                className="h-8 w-auto object-contain inline-block mr-1 brightness-110 hover:brightness-125 transition-all duration-300" 
              />
              <span className="tracking-[0.25em]">OULS</span><span className="text-primary font-bold">.</span>
            </Link>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-1">
              Client Dashboard
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-xs text-muted-foreground font-body">{userEmail}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-6 lg:px-12 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
            Client Enquiries
          </h1>
          <p className="text-muted-foreground font-body">
            All booking enquiries submitted across SOULS Media Group.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {[
            { label: "Total", value: stats.total },
            { label: "New", value: stats.newCount },
            { label: "In Review", value: stats.inReview },
            { label: "Confirmed", value: stats.confirmed },
            { label: "Declined", value: stats.declined },
          ].map((s) => (
            <Card key={s.label} className="p-6 bg-card/40 backdrop-blur border-border">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">{s.label}</p>
              <p className="font-display text-4xl font-bold text-foreground">{s.value}</p>
            </Card>
          ))}
        </div>

        <Card className="bg-card/40 backdrop-blur border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enquiries.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{e.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Mail className="w-3 h-3" /> {e.email}
                    </div>
                    {e.phone && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {e.phone}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs uppercase tracking-widest text-primary">{e.category}</span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-foreground">{e.project_type}</div>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                      {e.hours_required && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{e.hours_required}h</span>}
                      {e.num_shooters && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{e.num_shooters}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {e.preferred_date && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(e.preferred_date).toLocaleDateString()}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={`text-[10px] uppercase tracking-widest px-2 py-1 border inline-flex items-center gap-1 hover:bg-accent/40 transition-colors ${
                            statusStyles[e.status] ?? statusStyles.new
                          }`}
                        >
                          {e.status.replace("_", " ")}
                          <ChevronDown className="w-3 h-3 opacity-60" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background border-border">
                        {STATUS_OPTIONS.map((s) => (
                          <DropdownMenuItem
                            key={s}
                            onClick={() => updateStatus(e, s)}
                            disabled={e.status === s}
                            className="text-xs uppercase tracking-widest"
                          >
                            {s.replace("_", " ")}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(e.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

      </main>
    </div>
  );
};

export default Dashboard;
