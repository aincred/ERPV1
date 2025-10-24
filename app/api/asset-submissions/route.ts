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

    // Build security_checks
    const securityChecks: Record<string, any> = {};
    Object.keys(payload).forEach((key) => {
      if (key.endsWith("_photo") || key.endsWith("_cameraPhoto")) {
        const baseKey = key.replace(/_(photo|cameraPhoto)/, "");
        if (!securityChecks[baseKey]) securityChecks[baseKey] = {};
        securityChecks[baseKey].photo = payload[key];
      }
    });

    // map core fields into separate columns for querying
    const coreFields = {
      accept_type: payload.acceptType ?? null,
      asset_type: payload.assetType ?? null,
      manufacturer: payload.manufacturer ?? null,
      mac_address: payload.macAddress ?? null,
      ip_address: payload.ipAddress ?? null,
      location: payload.location ?? null,
      custodian: payload.custodian ?? null,
      os: payload.os ?? null,
      antivirus: payload.antivirus ?? null,
      windows_license_status: payload.windowsLicenseStatus ?? null,
    };

    const record = {
      ...coreFields,
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
