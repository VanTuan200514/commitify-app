import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { group_id, content } = await req.json();
    if (!group_id || !content) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const message = await db.groupMessages.create({
      data: {
        group_id,
        user_id: session.id,
        content
      },
      include: {
        user: { select: { name: true } }
      }
    });

    return NextResponse.json(message);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");
  if (!groupId) return NextResponse.json({ error: "Missing groupId" }, { status: 400 });

  try {
    const messages = await db.groupMessages.findMany({
      where: { group_id: groupId },
      orderBy: { created_at: "asc" },
      include: {
        user: { select: { name: true } }
      },
      take: 50
    });

    return NextResponse.json(messages);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
