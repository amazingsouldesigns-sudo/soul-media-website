import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { z } from "zod";
import { CalendarIcon, Check, ChevronLeft, ChevronRight, Paperclip, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const DELIVERABLE_OPTIONS = [
  "Photos",
  "Videos",
  "Edited highlight reel",
  "Social cut-downs",
  "Raw footage",
  "Drone coverage",
] as const;

const BUDGET_OPTIONS = [
  { value: "under_2k", label: "Under $2,000" },
  { value: "2k_5k", label: "$2,000 – $5,000" },
  { value: "5k_10k", label: "$5,000 – $10,000" },
  { value: "10k_plus", label: "$10,000+" },
  { value: "unsure", label: "Not sure yet" },
] as const;

const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB

interface FormState {
  // Step 1 — Project
  project_type: string;
  budget_range: string;
  deliverables: string[];
  // Step 2 — Logistics
  preferred_date: string; // ISO yyyy-mm-dd or "" if flexible
  flexible_date: boolean;
  hours_required: string;
  num_shooters: string;
  additional_requirements: string;
  // Step 3 — Contact
  name: string;
  email: string;
  phone: string;
  agreed_terms: boolean;
}

const initial: FormState = {
  project_type: "",
  budget_range: "",
  deliverables: [],
  preferred_date: "",
  flexible_date: false,
  hours_required: "",
  num_shooters: "",
  additional_requirements: "",
  name: "",
  email: "",
  phone: "",
  agreed_terms: false,
};

const step1Schema = z.object({
  project_type: z.string().trim().min(1, "Project type is required").max(100),
  budget_range: z.string().trim().min(1, "Pick a budget range"),
});

const step2Schema = z.object({
  hours_required: z.string().trim().max(50).optional().or(z.literal("")),
  num_shooters: z.string().trim().max(50).optional().or(z.literal("")),
  additional_requirements: z.string().trim().max(2000).optional().or(z.literal("")),
});

const step3Schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  agreed_terms: z.literal(true, { message: "You must agree to continue" }),
});

interface Props {
  category: string;
  categoryLabel: string;
}

const STEPS = ["Project", "Logistics", "Contact"] as const;

const BookingForm = ({ category, categoryLabel }: Props) => {
  const { toast } = useToast();
  const draftKey = `booking-draft:${category}`;

  const [step, setStep] = useState(0);
  const [values, setValues] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);
  const firstErrorRef = useRef<HTMLElement | null>(null);

  // Restore draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setValues({
          ...initial,
          ...parsed,
          // Guard against corrupted drafts so array fields never break rendering
          deliverables: Array.isArray(parsed?.deliverables) ? parsed.deliverables : [],
        });
      }
    } catch {
      /* ignore */
    }
  }, [draftKey]);

  // Autosave (debounced via micro-task batching)
  useEffect(() => {
    try {
      localStorage.setItem(draftKey, JSON.stringify(values));
    } catch {
      /* ignore */
    }
  }, [draftKey, values]);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setValues((v) => ({ ...v, [key]: val }));
    setErrors((e) => {
      if (!e[key as string]) return e;
      const { [key as string]: _omit, ...rest } = e;
      return rest;
    });
  };

  const toggleDeliverable = (val: string) => {
    setValues((v) => ({
      ...v,
      deliverables: v.deliverables.includes(val)
        ? v.deliverables.filter((d) => d !== val)
        : [...v.deliverables, val],
    }));
  };

  const handleFiles = (selected: FileList | null) => {
    if (!selected) return;
    const incoming = Array.from(selected);
    const ok: File[] = [];
    for (const f of incoming) {
      if (f.size > MAX_FILE_BYTES) {
        toast({ title: "File too large", description: `${f.name} exceeds 10MB`, variant: "destructive" });
        continue;
      }
      ok.push(f);
    }
    setFiles((prev) => [...prev, ...ok].slice(0, MAX_FILES));
  };

  const validateStep = (s: number): boolean => {
    let result;
    if (s === 0) result = step1Schema.safeParse(values);
    else if (s === 1) result = step2Schema.safeParse(values);
    else result = step3Schema.safeParse(values);

    if (result.success) {
      setErrors({});
      return true;
    }
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const k = issue.path[0] as string;
      if (k && !fieldErrors[k]) fieldErrors[k] = issue.message;
    }
    setErrors(fieldErrors);
    // Focus first invalid input
    queueMicrotask(() => {
      const firstKey = Object.keys(fieldErrors)[0];
      if (firstKey) {
        const el = document.querySelector<HTMLElement>(`[name="${firstKey}"]`);
        el?.focus();
        firstErrorRef.current = el;
      }
    });
    return false;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const uploadAttachments = async (): Promise<string[]> => {
    if (files.length === 0) return [];
    const urls: string[] = [];
    const folder = `${category}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    for (const file of files) {
      const safeName = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `${folder}/${safeName}`;
      const { error } = await supabase.storage.from("booking-attachments").upload(path, file, {
        contentType: file.type || "application/octet-stream",
      });
      if (error) {
        console.error("Upload failed", error);
        throw new Error(`Upload failed for ${file.name}: ${error.message}`);
      }
      urls.push(path);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    setSubmitting(true);
    try {
      const attachment_urls = await uploadAttachments();

      const { data, error } = await supabase
        .from("booking_enquiries")
        .insert({
          category,
          name: values.name,
          email: values.email,
          phone: values.phone || null,
          project_type: values.project_type,
          hours_required: values.hours_required || null,
          num_shooters: values.num_shooters || null,
          deliverables: values.deliverables.length ? values.deliverables : null,
          additional_requirements: values.additional_requirements || null,
          preferred_date: values.flexible_date ? null : values.preferred_date || null,
          budget_range: values.budget_range || null,
          attachment_urls: attachment_urls.length ? attachment_urls : null,
        })
        .select("id")
        .single();

      if (error) throw error;

      // Owner notification (best-effort; DB row is source of truth)
      supabase.functions
        .invoke("notify-booking-enquiry", {
          body: {
            category: categoryLabel,
            ...values,
            attachment_count: attachment_urls.length,
          },
        })
        .catch(() => {});

      // Local-only reference (batch 2 will replace with server-generated SMG-YYYY-####)
      const ref = `SMG-${new Date().getFullYear()}-${(data?.id ?? "").slice(0, 4).toUpperCase()}`;
      setReferenceCode(ref);

      toast({ title: "Enquiry received", description: "We'll be in touch within 24 hours." });
      setSubmitted(true);
      localStorage.removeItem(draftKey);
    } catch (err) {
      console.error("Booking submit failed", err);
      toast({
        title: "Something went wrong",
        description: err instanceof Error ? err.message : "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setValues(initial);
    setFiles([]);
    setStep(0);
    setSubmitted(false);
    setReferenceCode(null);
    setErrors({});
    localStorage.removeItem(draftKey);
  };

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-primary/40 bg-primary/5 p-10 text-center"
      >
        <div className="font-display text-3xl font-bold uppercase text-foreground mb-3">
          Enquiry Received
        </div>
        {referenceCode && (
          <p className="text-xs font-body tracking-[0.3em] uppercase text-primary mb-4">
            Reference: {referenceCode}
          </p>
        )}
        <p className="text-muted-foreground font-body mb-6 max-w-md mx-auto">
          Thanks for reaching out. We'll respond within 24 hours with a tailored quote. You can check
          status any time from the Booking Status page.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button variant="outline" onClick={reset}>
            Submit another enquiry
          </Button>
          <Button asChild>
            <a href="/booking-status">Check booking status →</a>
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={cn(
                  "w-6 h-6 flex items-center justify-center border text-[10px] font-body font-bold transition-colors",
                  i < step
                    ? "bg-primary border-primary text-primary-foreground"
                    : i === step
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground"
                )}
              >
                {i < step ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] font-body tracking-[0.3em] uppercase hidden sm:inline",
                  i === step ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="h-px bg-border relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <Field label="What are you building? *" error={errors.project_type}>
              <Input
                name="project_type"
                value={values.project_type}
                onChange={(e) => set("project_type", e.target.value)}
                placeholder={`e.g. ${categoryLabel} shoot, brand activation, music video…`}
                aria-invalid={!!errors.project_type}
                aria-describedby={errors.project_type ? "project_type-err" : undefined}
              />
            </Field>

            <Field label="Budget range *" error={errors.budget_range}>
              <Select value={values.budget_range} onValueChange={(v) => set("budget_range", v)}>
                <SelectTrigger
                  aria-invalid={!!errors.budget_range}
                  aria-describedby={errors.budget_range ? "budget_range-err" : undefined}
                >
                  <SelectValue placeholder="Pick a range" />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_OPTIONS.map((b) => (
                    <SelectItem key={b.value} value={b.value}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Hidden input so focus() works for validation focusing */}
              <input
                type="hidden"
                name="budget_range"
                value={values.budget_range}
                readOnly
                tabIndex={-1}
              />
            </Field>

            <div>
              <Label className="text-xs font-body font-medium tracking-[0.3em] uppercase text-muted-foreground">
                Deliverables
              </Label>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                {DELIVERABLE_OPTIONS.map((opt) => {
                  const checked = values.deliverables.includes(opt);
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => toggleDeliverable(opt)}
                      aria-pressed={checked}
                      className={`flex items-center gap-3 border px-4 py-3 text-left transition-all duration-200 ${
                        checked
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
                          checked
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-primary",
                        )}
                      >
                        {checked && <Check className="h-3 w-3" />}
                      </span>
                      <span className="text-sm font-body">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div>
              <Label className="text-xs font-body font-medium tracking-[0.3em] uppercase text-muted-foreground">
                Preferred date
              </Label>
              <div className="mt-3 flex flex-col sm:flex-row gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={values.flexible_date}
                      className={cn(
                        "w-full sm:w-[260px] justify-start text-left font-normal",
                        !values.preferred_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {values.preferred_date && !values.flexible_date
                        ? format(new Date(values.preferred_date), "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={values.preferred_date ? new Date(values.preferred_date) : undefined}
                      onSelect={(d) =>
                        set("preferred_date", d ? format(d, "yyyy-MM-dd") : "")
                      }
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <label className="flex items-center gap-3 border border-border bg-card px-4 py-2 cursor-pointer">
                  <Checkbox
                    checked={values.flexible_date}
                    onCheckedChange={(c) => set("flexible_date", c === true)}
                  />
                  <span className="text-sm font-body text-foreground">I'm flexible / not sure</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Hours required" error={errors.hours_required}>
                <Input
                  name="hours_required"
                  value={values.hours_required}
                  onChange={(e) => set("hours_required", e.target.value)}
                  placeholder="e.g. 4 hours, full day"
                />
              </Field>
              <Field label="Number of shooters" error={errors.num_shooters}>
                <Input
                  name="num_shooters"
                  value={values.num_shooters}
                  onChange={(e) => set("num_shooters", e.target.value)}
                  placeholder="e.g. 1 photographer + 2 videographers"
                />
              </Field>
            </div>

            <Field label="Additional requirements" error={errors.additional_requirements}>
              <Textarea
                name="additional_requirements"
                value={values.additional_requirements}
                onChange={(e) => set("additional_requirements", e.target.value)}
                placeholder="Venue, vibe, references, budget specifics — anything that helps us scope it right."
                rows={5}
              />
            </Field>

            <div>
              <Label className="text-xs font-body font-medium tracking-[0.3em] uppercase text-muted-foreground">
                References / mood board (optional)
              </Label>
              <div className="mt-3 border border-dashed border-border bg-card/40 p-6">
                <label className="flex items-center justify-center gap-3 cursor-pointer text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                  <Paperclip className="w-4 h-4" />
                  <span>
                    {files.length >= MAX_FILES
                      ? "Maximum 5 files reached"
                      : "Click to attach files (max 5 × 10MB)"}
                  </span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                    disabled={files.length >= MAX_FILES}
                    accept="image/*,application/pdf,.doc,.docx,.txt"
                  />
                </label>
                {files.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {files.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between text-xs font-body text-foreground border border-border bg-background px-3 py-2"
                      >
                        <span className="truncate">{f.name}</span>
                        <button
                          type="button"
                          onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                          className="text-muted-foreground hover:text-destructive ml-3"
                          aria-label={`Remove ${f.name}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Name *" error={errors.name}>
                <Input
                  name="name"
                  value={values.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Your full name"
                  aria-invalid={!!errors.name}
                />
              </Field>
              <Field label="Email *" error={errors.email}>
                <Input
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                />
              </Field>
            </div>

            <Field label="Phone / WhatsApp (include country code)" error={errors.phone}>
              <Input
                name="phone"
                value={values.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+1 868 555 1234"
              />
            </Field>

            {/* Summary */}
            <div className="border border-border bg-card/40 p-5">
              <p className="text-[10px] font-body font-bold tracking-[0.3em] uppercase text-primary mb-3">
                Review your enquiry
              </p>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <SummaryRow label="Category" value={categoryLabel} />
                <SummaryRow label="Project" value={values.project_type || "—"} />
                <SummaryRow
                  label="Budget"
                  value={
                    BUDGET_OPTIONS.find((b) => b.value === values.budget_range)?.label || "—"
                  }
                />
                <SummaryRow
                  label="Date"
                  value={
                    values.flexible_date
                      ? "Flexible"
                      : values.preferred_date
                      ? format(new Date(values.preferred_date), "PPP")
                      : "—"
                  }
                />
                <SummaryRow label="Hours" value={values.hours_required || "—"} />
                <SummaryRow label="Shooters" value={values.num_shooters || "—"} />
                <SummaryRow
                  label="Deliverables"
                  value={values.deliverables.length ? values.deliverables.join(", ") : "—"}
                  full
                />
                <SummaryRow label="Files" value={files.length ? `${files.length} attached` : "None"} />
              </dl>
            </div>

            <Field error={errors.agreed_terms}>
              <label className="flex items-start gap-3 text-sm font-body text-foreground cursor-pointer">
                <Checkbox
                  checked={values.agreed_terms}
                  onCheckedChange={(c) => set("agreed_terms", c === true)}
                  name="agreed_terms"
                />
                <span className="text-muted-foreground">
                  I agree to be contacted about this enquiry and have read the{" "}
                  <a href="/privacy" className="text-primary hover:underline">
                    privacy notice
                  </a>
                  .
                </span>
              </label>
            </Field>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <Button
          type="button"
          variant="ghost"
          onClick={back}
          disabled={step === 0 || submitting}
          className="text-xs font-body tracking-[0.3em] uppercase"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button
            type="button"
            onClick={next}
            className="h-11 px-8 text-xs font-body font-medium tracking-[0.3em] uppercase"
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={submitting}
            className="h-11 px-10 text-xs font-body font-medium tracking-[0.3em] uppercase"
          >
            {submitting ? "Sending…" : "Submit enquiry"}
          </Button>
        )}
      </div>
    </form>
  );
};

const Field = ({
  label,
  error,
  children,
}: {
  label?: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    {label && (
      <Label className="text-xs font-body font-medium tracking-[0.3em] uppercase text-muted-foreground">
        {label}
      </Label>
    )}
    {children}
    {error && <p className="text-xs text-destructive font-body">{error}</p>}
  </div>
);

const SummaryRow = ({ label, value, full }: { label: string; value: string; full?: boolean }) => (
  <div className={full ? "sm:col-span-2" : ""}>
    <dt className="text-[10px] font-body tracking-[0.2em] uppercase text-muted-foreground">
      {label}
    </dt>
    <dd className="text-sm font-body text-foreground truncate">{value}</dd>
  </div>
);

export default BookingForm;
