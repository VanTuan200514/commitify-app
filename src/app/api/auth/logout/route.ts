import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const c = await cookies();
  c.delete("commitify_session");
  return NextResponse.json({ success: true });
}
