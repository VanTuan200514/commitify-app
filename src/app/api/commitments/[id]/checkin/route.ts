import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    const commitmentId = resolvedParams.id;
    const body = await req.json();
    const { status, note, progress_value } = body;

    // Check if commitment belongs to user
    const commitment = await db.commitment.findUnique({
      where: { id: commitmentId, user_id: session.id }
    });

    if (!commitment) {
      return NextResponse.json({ error: "Thử thách không tồn tại hoặc không có quyền" }, { status: 404 });
    }

    // Check if already checked-in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingProgress = await db.commitmentProgress.findFirst({
      where: {
        commitment_id: commitmentId,
        date: { gte: today }
      }
    });

    if (existingProgress) {
      // Update existing check-in
      const updated = await db.commitmentProgress.update({
        where: { id: existingProgress.id },
        data: {
          status,
          note: note || existingProgress.note,
          progress_value: progress_value ?? existingProgress.progress_value
        }
      });
      return NextResponse.json(updated, { status: 200 });
    }

    // Create new check-in
    const progress = await db.commitmentProgress.create({
      data: {
        commitment_id: commitmentId,
        user_id: session.id,
        status,
        note: note || null,
        progress_value: progress_value || (status === 'done' ? 100 : 0)
      }
    });

    return NextResponse.json(progress, { status: 201 });
  } catch (error: any) {
    console.error("Check-in Error:", error);
    return NextResponse.json({ error: "Lỗi thực hiện check-in" }, { status: 500 });
  }
}
