import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseServer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "missing_credentials" }, { status: 400 });
    }

    // fetch user by email
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, email, password_hash, role, full_name")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Supabase user lookup error:", error);
      return NextResponse.json({ success: false, error: "lookup_failed" }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ success: false, error: "invalid_credentials" }, { status: 401 });
    }

    // compare password
    const match = bcrypt.compareSync(password, user.password_hash);
    if (!match) {
      return NextResponse.json({ success: false, error: "invalid_credentials" }, { status: 401 });
    }

    // sign JWT
    const jwtSecret = process.env.JWT_SECRET as string;
    if (!jwtSecret) {
      console.error("Missing JWT_SECRET");
      return NextResponse.json({ success: false, error: "server_misconfigured" }, { status: 500 });
    }

    const expiresIn = process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN) : 3600;
    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role, name: user.full_name || null },
      jwtSecret,
      { expiresIn }
    );

    // set cookie (httpOnly, Secure, SameSite=Lax)
    const res = NextResponse.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn,
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ success: false, error: "internal_error" }, { status: 500 });
  }
}
