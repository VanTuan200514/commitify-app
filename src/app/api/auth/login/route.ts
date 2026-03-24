import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Thanh toán email hoặc mật khẩu" }, { status: 400 });
    }

    const user = await db.users.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: "Mật khẩu không chính xác" }, { status: 401 });
    }

    const token = await encrypt({ id: user.id, email: user.email, name: user.name });

    const c = await cookies();
    c.set("commitify_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } }, { status: 200 });
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Lỗi đăng nhập" }, { status: 500 });
  }
}
