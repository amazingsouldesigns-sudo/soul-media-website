import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { SOULS_LOGO_COPY } from "@/lib/logos";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  LogOut,
  Mail,
  Phone,
  Calendar,
  Users,
  Clock,
  ChevronDown,
  Download,
  FileText,
  Loader2,
} from "lucide-react";
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

const BUDGET_LABELS: Record<string, string> = {
  under_2k: "Under $2,000",
  "2k_5k": "$2,000 – $5,000",
  "5k_10k": "$5,000 – $10,000",
  "10k_plus": "$10,000+",
  unsure: "Not sure yet",
};

const budgetLabel = (v?: string | null) => (v ? BUDGET_LABELS[v] ?? v : "—");

type SignedFile = { path: string; name: string; url: string | null };

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [files, setFiles] = useState<SignedFile[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }

      // Only admins may view enquiries
      const { data: adminRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!adminRole) {
        navigate("/", { replace: true });
        return;
      }

      setUserEmail(session.user.email ?? "");

      const { data } = await supabase
        .from("booking_enquiries")
        .select("*")
        .order("created_at", { ascending: false });
      setEnquiries(data ?? []);
      setLoading(false);
    };
    init();
  }, [navigate]);


  // Generate signed URLs for the selected enquiry's attachments (private bucket)
  useEffect(() => {
    const paths = selected?.attachment_urls ?? [];
    if (!selected || paths.length === 0) {
      setFiles([]);
      return;
    }
    let cancelled = false;
    setFilesLoading(true);
    (async () => {
      const resolved = await Promise.all(
        paths.map(async (path): Promise<SignedFile> => {
          const name = path.split("/").pop() || path;
          const { data } = await supabase.storage
            .from("booking-attachments")
            .createSignedUrl(path, 60 * 60);
          return { path, name, url: data?.signedUrl ?? null };
        }),
      );
      if (!cancelled) {
        setFiles(resolved);
        setFilesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selected]);

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
    setSelected((cur) => (cur && cur.id === enquiry.id ? { ...cur, status } : cur));

    const { error } = await supabase
      .from("booking_enquiries")
      .update({ status })
      .eq("id", enquiry.id);

    if (error) {
      setEnquiries((list) =>
        list.map((e) => (e.id === enquiry.id ? { ...e, status: prev } : e)),
      );
      setSelected((cur) => (cur && cur.id === enquiry.id ? { ...cur, status: prev } : cur));
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
                src={SOULS_LOGO_COPY} 
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
              {enquiries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16 text-muted-foreground font-body text-sm">
                    No enquiries yet. New booking submissions will appear here.
                  </TableCell>
                </TableRow>
              )}
              {enquiries.map((e) => (
                <TableRow
                  key={e.id}
                  onClick={() => setSelected(e)}
                  className="cursor-pointer hover:bg-accent/20 transition-colors"
                >
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
                  <TableCell onClick={(ev) => ev.stopPropagation()}>
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

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="text-left">
                <SheetTitle className="font-display text-2xl">{selected.name}</SheetTitle>
                <SheetDescription>
                  <span className="uppercase tracking-widest text-primary text-xs">
                    {selected.category}
                  </span>
                  {" · "}
                  {selected.project_type}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6">
                <span
                  className={`text-[10px] uppercase tracking-widest px-2 py-1 border inline-flex items-center gap-1 ${
                    statusStyles[selected.status] ?? statusStyles.new
                  }`}
                >
                  {selected.status.replace("_", " ")}
                </span>
              </div>

              <div className="mt-8 space-y-6">
                <DetailSection title="Contact">
                  <DetailRow label="Name" value={selected.name} />
                  <DetailRow label="Email" value={selected.email} href={`mailto:${selected.email}`} />
                  <DetailRow
                    label="Phone"
                    value={selected.phone}
                    href={selected.phone ? `tel:${selected.phone}` : undefined}
                  />
                </DetailSection>

                <DetailSection title="Project">
                  <DetailRow label="Category" value={selected.category} />
                  <DetailRow label="Project type" value={selected.project_type} />
                  <DetailRow label="Budget" value={budgetLabel(selected.budget_range)} />
                  <DetailRow
                    label="Deliverables"
                    value={
                      selected.deliverables && selected.deliverables.length
                        ? selected.deliverables.join(", ")
                        : "—"
                    }
                  />
                </DetailSection>

                <DetailSection title="Logistics">
                  <DetailRow
                    label="Preferred date"
                    value={
                      selected.preferred_date
                        ? new Date(selected.preferred_date).toLocaleDateString()
                        : "Flexible"
                    }
                  />
                  <DetailRow label="Hours required" value={selected.hours_required} />
                  <DetailRow label="Shooters" value={selected.num_shooters} />
                  <DetailRow
                    label="Additional requirements"
                    value={selected.additional_requirements}
                    block
                  />
                </DetailSection>

                <DetailSection title="Attachments">
                  {filesLoading ? (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading files…
                    </div>
                  ) : files.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No files attached.</p>
                  ) : (
                    <ul className="space-y-2">
                      {files.map((f) => (
                        <li key={f.path}>
                          {f.url ? (
                            <a
                              href={f.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between gap-3 border border-border bg-card px-3 py-2 text-sm text-foreground hover:border-primary transition-colors"
                            >
                              <span className="flex items-center gap-2 truncate">
                                <FileText className="w-4 h-4 shrink-0 text-primary" />
                                <span className="truncate">{f.name}</span>
                              </span>
                              <Download className="w-4 h-4 shrink-0 opacity-70" />
                            </a>
                          ) : (
                            <span className="flex items-center gap-2 text-sm text-muted-foreground">
                              <FileText className="w-4 h-4" /> {f.name} (unavailable)
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </DetailSection>

                <DetailSection title="Meta">
                  <DetailRow
                    label="Submitted"
                    value={new Date(selected.created_at).toLocaleString()}
                  />
                  <DetailRow
                    label="Last updated"
                    value={new Date(selected.updated_at).toLocaleString()}
                  />
                  <DetailRow label="Reference" value={`SMG-${new Date(selected.created_at).getFullYear()}-${selected.id.slice(0, 4).toUpperCase()}`} />
                </DetailSection>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

const DetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <p className="text-[10px] font-body font-bold tracking-[0.3em] uppercase text-primary mb-3">
      {title}
    </p>
    <div className="space-y-2">{children}</div>
  </div>
);

const DetailRow = ({
  label,
  value,
  href,
  block,
}: {
  label: string;
  value?: string | null;
  href?: string;
  block?: boolean;
}) => (
  <div className={block ? "" : "flex items-start justify-between gap-4"}>
    <dt className="text-[10px] font-body tracking-[0.2em] uppercase text-muted-foreground shrink-0">
      {label}
    </dt>
    {href && value ? (
      <a
        href={href}
        className={`text-sm font-body text-foreground hover:text-primary break-words ${block ? "mt-1 block" : "text-right"}`}
      >
        {value}
      </a>
    ) : (
      <dd className={`text-sm font-body text-foreground break-words ${block ? "mt-1" : "text-right"}`}>
        {value || "—"}
      </dd>
    )}
  </div>
);

export default Dashboard;
