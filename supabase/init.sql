import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // find photo keys (data-url images)
    const photoKeys = Object.keys(payload).filter((k) =>
      k.endsWith("_photo") || k.endsWith("_cameraPhoto")
    );

    const uploadedUrls: Record<string, string | null> = {};

    for (const key of photoKeys) {
      const value = payload[key];
      if (!value || typeof value !== "string") continue;

      const match = value.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (!match) {
        uploadedUrls[key] = null;
        continue;
      }

      const mime = match[1];
      const b64 = match[2];
      const buffer = Buffer.from(b64, "base64");
      const ext = mime.split("/")[1] || "png";
      const filename = `${Date.now()}_${key}.${ext}`;
      const path = filename;

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from("asset-photos")
        .upload(path, buffer, {
          contentType: mime,
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error for", key, uploadError);
        uploadedUrls[key] = null;
        continue;
      }

      // get public URL
      const { data: publicData } = supabaseAdmin.storage.from("asset-photos").getPublicUrl(uploadData.path);
      const publicUrl = (publicData as any)?.publicUrl || (publicData as any)?.publicURL || null;
      uploadedUrls[key] = publicUrl;
      // replace in payload so inserted data contains URL
      if (publicUrl) payload[key] = publicUrl;
    }

    // Build security_checks if desired (keep same logic as client)
    const securityChecks: Record<string, any> = {};
    Object.keys(payload).forEach((key) => {
      if (key.endsWith("_photo") || key.endsWith("_cameraPhoto")) {
        const baseKey = key.replace(/_(photo|cameraPhoto)/, "");
        if (!securityChecks[baseKey]) securityChecks[baseKey] = {};
        securityChecks[baseKey].photo = payload[key];
      }
    });

    const record = {
      data: payload,
      security_checks: securityChecks,
      submitted_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabaseAdmin.from("asset_submissions").insert([record]);

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ success: false, error: "db_insert_failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ success: false, error: "internal_error" }, { status: 500 });
  }
}

// Enable pgcrypto so we can generate UUIDs
create extension if not exists "pgcrypto";

// Table to store form submissions
create table if not exists public.asset_submissions (
  id uuid default gen_random_uuid() primary key,
  accept_type text,
  asset_type text,
  manufacturer text,
  mac_address text,
  ip_address text,
  location text,
  custodian text,
  os text,
  antivirus text,
  windows_license_status text,
  security_checks jsonb,
  data jsonb not null,
  submitted_at timestamptz default now()
);

// If table already exists, ensure columns exist (safe to run multiple times)
alter table public.asset_submissions add column if not exists accept_type text;
alter table public.asset_submissions add column if not exists asset_type text;
alter table public.asset_submissions add column if not exists manufacturer text;
alter table public.asset_submissions add column if not exists mac_address text;
alter table public.asset_submissions add column if not exists ip_address text;
alter table public.asset_submissions add column if not exists location text;
alter table public.asset_submissions add column if not exists custodian text;
alter table public.asset_submissions add column if not exists os text;
alter table public.asset_submissions add column if not exists antivirus text;
alter table public.asset_submissions add column if not exists windows_license_status text;
alter table public.asset_submissions add column if not exists security_checks jsonb;
alter table public.asset_submissions add column if not exists data jsonb;
alter table public.asset_submissions add column if not exists submitted_at timestamptz default now();

// Optional: index on common query columns
create index if not exists idx_asset_submissions_submitted_at on public.asset_submissions (submitted_at);
create index if not exists idx_asset_submissions_asset_type on public.asset_submissions (asset_type);
create index if not exists idx_asset_submissions_manufacturer on public.asset_submissions (manufacturer);