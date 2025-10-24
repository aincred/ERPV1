import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

function parseTokenFromCookie(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|; )token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function GET(req: Request) {
  try {
    const token = parseTokenFromCookie(req);
    if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });

    const jwtSecret = process.env.JWT_SECRET as string;
    if (!jwtSecret) return NextResponse.json({ authenticated: false }, { status: 500 });

    let payload: any;
    try {
      payload = jwt.verify(token, jwtSecret);
    } catch (e) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // minimal payload return
    return NextResponse.json({ authenticated: true, user: payload });
  } catch (err) {
    console.error("Auth me error:", err);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
