import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, category, startDate, endDate, targetType } = body;

    if (!title || !category || !startDate || !targetType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const commitment = await db.commitment.create({
      data: {
        user_id: session.id,
        title,
        description: description || null,
        category,
        start_date: new Date(startDate),
        end_date: endDate ? new Date(endDate) : null,
        target_type: targetType,
        status: "active",
      },
    });

    return NextResponse.json(commitment, { status: 201 });
  } catch (error: any) {
    console.error("Create Commitment Error:", error);
    return NextResponse.json({ error: "Failed to create commitment" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const commitments = await db.commitment.findMany({
      where: { user_id: session.id },
      orderBy: { start_date: "desc" },
    });

    return NextResponse.json(commitments, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch commitments" }, { status: 500 });
  }
}
