// Notify owner of a new booking enquiry.
// This function is best-effort: if email infrastructure isn't fully configured yet,
// it returns 200 so the form UX isn't blocked. Enquiries are always saved to DB.

import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const OWNER_EMAIL = "souldesignsphotos@proton.me";
const SITE_NAME = "SOULS Media Group";

interface EnquiryPayload {
  category?: string;
  name?: string;
  email?: string;
  phone?: string;
  project_type?: string;
  hours_required?: string;
  num_shooters?: string;
  preferred_date?: string;
  additional_requirements?: string;
  deliverables?: string[];
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );

const row = (label: string, value?: string | string[] | null) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return "";
  const v = Array.isArray(value) ? value.join(", ") : value;
  return `<tr><td style="padding:8px 12px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;border-bottom:1px solid #eee;width:180px;vertical-align:top;">${label}</td><td style="padding:8px 12px;color:#111;font-size:14px;border-bottom:1px solid #eee;">${escapeHtml(v)}</td></tr>`;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: EnquiryPayload = await req.json();

    const html = `
      <html><body style="font-family:Arial,sans-serif;background:#fff;padding:24px;">
        <h2 style="color:#000;margin:0 0 8px;">New ${SITE_NAME} enquiry</h2>
        <p style="color:#666;margin:0 0 20px;font-size:14px;">Category: <strong>${escapeHtml(payload.category || "—")}</strong></p>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          ${row("Name", payload.name)}
          ${row("Email", payload.email)}
          ${row("Phone", payload.phone)}
          ${row("Project type", payload.project_type)}
          ${row("Hours", payload.hours_required)}
          ${row("Shooters", payload.num_shooters)}
          ${row("Preferred date", payload.preferred_date)}
          ${row("Deliverables", payload.deliverables)}
          ${row("Notes", payload.additional_requirements)}
        </table>
        <p style="color:#999;font-size:12px;margin-top:24px;">Reply directly to ${escapeHtml(payload.email || OWNER_EMAIL)} to follow up.</p>
      </body></html>
    `;

    // Attempt to send via Lovable Email API. If LOVABLE_API_KEY isn't configured
    // or the email domain isn't ready, log and return success so form UX isn't blocked.
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      console.log("LOVABLE_API_KEY not set — skipping email send. Enquiry saved to DB.");
      return new Response(
        JSON.stringify({ ok: true, emailed: false, reason: "no_api_key" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    try {
      const res = await fetch("https://api.lovable.dev/v1/emails/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          to: OWNER_EMAIL,
          subject: `New ${payload.category || "booking"} enquiry — ${payload.name || "anon"}`,
          html,
          replyTo: payload.email,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.log(`Email send returned ${res.status}: ${text}`);
        return new Response(
          JSON.stringify({ ok: true, emailed: false, reason: `api_${res.status}` }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } catch (err) {
      console.log("Email send threw:", err);
      return new Response(
        JSON.stringify({ ok: true, emailed: false, reason: "send_error" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, emailed: true }),
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
