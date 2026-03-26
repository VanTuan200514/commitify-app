import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, description } = await req.json();
    if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 });

    const group = await db.groups.create({
      data: {
        name,
        description,
        members: {
          create: {
            user_id: session.id,
            role: "owner"
          }
        }
      }
    });

    return NextResponse.json(group);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
