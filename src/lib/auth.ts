import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.JWT_SECRET_KEY || "SuperSecretFallbackKeyInDevelopmentOhBoy123";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const c = await cookies();
  const sessionToken = c.get("commitify_session")?.value;
  if (!sessionToken) return null;
  return await decrypt(sessionToken);
}

export async function updateSession(request: NextRequest) {
  const sessionToken = request.cookies.get("commitify_session")?.value;
  if (!sessionToken) return;

  // Refresh session so it doesn't expire
  const parsed = await decrypt(sessionToken);
  if (parsed) {
    const res = NextResponse.next();
    const newToken = await encrypt({ id: parsed.id, email: parsed.email, name: parsed.name });
    res.cookies.set({
      name: "commitify_session",
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      sameSite: "lax",
    });
    return res;
  }
}
