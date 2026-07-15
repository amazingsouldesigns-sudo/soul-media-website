// Booking enquiry emails: notifies the owner AND sends the customer a
// confirmation ("we'll get back to you within 24 hours").
//
// Accepts two payload shapes:
//   1. Direct invoke from the site: the enquiry fields as a flat JSON object.
//   2. Supabase Database Webhook on INSERT: { type, table, record: {...} }.
//
// Best-effort: if email isn't configured, returns 200 so the form UX isn't blocked.
// Requires secrets: RESEND_API_KEY, and RESEND_FROM once a domain is verified
// (falls back to the Resend sandbox sender, which can only reach the owner).

import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const OWNER_EMAIL = "souldesignsphotos@proton.me";
const SITE_NAME = "SOULS Media Group";
const SITE_URL = "https://soulmediagroup.com"; // used in email footer links; update if domain differs

interface EnquiryPayload {
  category?: string;
  name?: string;
  email?: string;
  phone?: string;
  project_type?: string;
  budget_range?: string;
  hours_required?: string;
  num_shooters?: string;
  preferred_date?: string;
  flexible_date?: boolean;
  additional_requirements?: string;
  deliverables?: string[];
  attachment_count?: number;
  attachment_urls?: string[];
}

const BUDGET_LABELS: Record<string, string> = {
  under_2k: "Under $2,000",
  "2k_5k": "$2,000 – $5,000",
  "5k_10k": "$5,000 – $10,000",
  "10k_plus": "$10,000+",
  unsure: "Not sure yet",
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );

const row = (label: string, value?: string | string[] | null) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return "";
  const v = Array.isArray(value) ? value.join(", ") : value;
  return `<tr><td style="padding:8px 12px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;border-bottom:1px solid #eee;width:180px;vertical-align:top;">${label}</td><td style="padding:8px 12px;color:#111;font-size:14px;border-bottom:1px solid #eee;">${escapeHtml(v)}</td></tr>`;
};

/** Dark, on-brand row for the customer email. */
const darkRow = (label: string, value?: string | string[] | null) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return "";
  const v = Array.isArray(value) ? value.join(", ") : value;
  return `<tr><td style="padding:10px 14px;color:#8a8a8a;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;border-bottom:1px solid #232326;width:160px;vertical-align:top;font-family:'Courier New',monospace;">${label}</td><td style="padding:10px 14px;color:#fafafa;font-size:14px;border-bottom:1px solid #232326;">${escapeHtml(v)}</td></tr>`;
};

const ownerHtml = (p: EnquiryPayload) => `
  <html><body style="font-family:Arial,sans-serif;background:#fff;padding:24px;">
    <h2 style="color:#000;margin:0 0 8px;">New ${SITE_NAME} enquiry</h2>
    <p style="color:#666;margin:0 0 20px;font-size:14px;">Category: <strong>${escapeHtml(p.category || "-")}</strong></p>
    <table style="border-collapse:collapse;width:100%;max-width:600px;">
      ${row("Name", p.name)}
      ${row("Email", p.email)}
      ${row("Phone", p.phone)}
      ${row("Project type", p.project_type)}
      ${row("Budget", p.budget_range ? (BUDGET_LABELS[p.budget_range] ?? p.budget_range) : "")}
      ${row("Hours", p.hours_required)}
      ${row("Shooters", p.num_shooters)}
      ${row("Preferred date", p.flexible_date ? "Flexible" : p.preferred_date)}
      ${row("Deliverables", p.deliverables)}
      ${row("Attachments", p.attachment_count ? String(p.attachment_count) : "")}
      ${row("Notes", p.additional_requirements)}
    </table>
    <p style="color:#999;font-size:12px;margin-top:24px;">Reply directly to ${escapeHtml(p.email || OWNER_EMAIL)} to follow up.</p>
  </body></html>
`;

const customerHtml = (p: EnquiryPayload) => {
  const firstName = (p.name || "").trim().split(/\s+/)[0] || "there";
  return `
  <html><body style="margin:0;padding:0;background:#0a0a0b;">
    <div style="max-width:600px;margin:0 auto;padding:40px 24px;font-family:Arial,Helvetica,sans-serif;">
      <p style="color:#8a8a8a;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-family:'Courier New',monospace;margin:0 0 24px;">[ ${SITE_NAME.toUpperCase()} ]</p>

      <h1 style="color:#fafafa;font-size:28px;line-height:1.2;margin:0 0 16px;font-weight:600;">
        Thanks, ${escapeHtml(firstName)}. <span style="color:#ff2929;font-style:italic;font-family:Georgia,serif;">We got it</span>.
      </h1>

      <p style="color:#b5b5b5;font-size:15px;line-height:1.6;margin:0 0 28px;">
        Your ${escapeHtml(p.category || "project")} enquiry just landed with our team.
        We review every brief personally and will get back to you
        <strong style="color:#fafafa;">within 24 hours</strong> with scope, crew, and pricing.
      </p>

      <table style="border-collapse:collapse;width:100%;background:#131316;border:1px solid #232326;border-radius:12px;overflow:hidden;">
        ${darkRow("Category", p.category)}
        ${darkRow("Project type", p.project_type)}
        ${darkRow("Budget", p.budget_range ? (BUDGET_LABELS[p.budget_range] ?? p.budget_range) : "")}
        ${darkRow("Preferred date", p.flexible_date ? "Flexible" : p.preferred_date)}
        ${darkRow("Deliverables", p.deliverables)}
      </table>

      <p style="color:#b5b5b5;font-size:14px;line-height:1.6;margin:28px 0;">
        Need to add something or in a hurry? Just reply to this email
        or check your booking status any time at
        <a href="${SITE_URL}/booking-status" style="color:#ff2929;text-decoration:none;">${SITE_URL.replace("https://", "")}/booking-status</a>.
      </p>

      <p style="color:#8a8a8a;font-size:12px;line-height:1.6;margin:36px 0 0;border-top:1px solid #232326;padding-top:20px;font-family:'Courier New',monospace;letter-spacing:0.05em;">
        ${SITE_NAME} · Premium video production<br/>
        Crafted with obsession
      </p>
    </div>
  </body></html>
`;
};

/** Normalise direct-invoke and DB-webhook payloads to a flat enquiry object. */
const normalise = (body: Record<string, unknown>): EnquiryPayload => {
  if (body && typeof body === "object" && "record" in body && body.record && typeof body.record === "object") {
    const r = body.record as EnquiryPayload;
    return { ...r, attachment_count: r.attachment_urls?.length ?? 0 };
  }
  return body as EnquiryPayload;
};

const sendEmail = async (
  apiKey: string,
  msg: { from: string; to: string[]; subject: string; html: string; reply_to?: string }
): Promise<{ sent: boolean; reason?: string }> => {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(msg),
    });
    if (!res.ok) {
      const text = await res.text();
      console.log(`Resend returned ${res.status}: ${text}`);
      return { sent: false, reason: `api_${res.status}` };
    }
    return { sent: true };
  } catch (err) {
    console.log("Email send threw:", err);
    return { sent: false, reason: "send_error" };
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = normalise(await req.json());

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.log("RESEND_API_KEY not set - skipping email send.");
      return new Response(
        JSON.stringify({ ok: true, emailed: false, reason: "no_api_key" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const from = Deno.env.get("RESEND_FROM") ?? "SOULS Media <onboarding@resend.dev>";
    const usingSandboxSender = from.includes("resend.dev");

    // 1. Owner notification
    const owner = await sendEmail(apiKey, {
      from,
      to: [OWNER_EMAIL],
      subject: `New ${payload.category || "booking"} enquiry - ${payload.name || "anon"}`,
      html: ownerHtml(payload),
      reply_to: payload.email || undefined,
    });

    // 2. Customer confirmation (needs a verified domain; the sandbox sender
    //    can't reach arbitrary addresses, so skip to avoid guaranteed bounces)
    let customer: { sent: boolean; reason?: string } = { sent: false, reason: "no_customer_email" };
    if (payload.email && !usingSandboxSender) {
      customer = await sendEmail(apiKey, {
        from,
        to: [payload.email],
        subject: `We got your enquiry - ${SITE_NAME}`,
        html: customerHtml(payload),
        reply_to: OWNER_EMAIL,
      });
    } else if (payload.email && usingSandboxSender) {
      customer = { sent: false, reason: "sandbox_sender_cannot_email_customers" };
      console.log("RESEND_FROM is the sandbox sender - customer confirmation skipped. Verify a domain and set RESEND_FROM.");
    }

    return new Response(
      JSON.stringify({ ok: true, owner, customer }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Handler error:", err);
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
