import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { content, mood } = await req.json();

    if (!content || !mood) {
      return NextResponse.json({ error: "Thiếu nội dung hoặc cảm xúc" }, { status: 400 });
    }

    const reflection = await db.reflection.create({
      data: {
        user_id: session.id,
        content,
        mood,
      },
    });

    return NextResponse.json(reflection);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
