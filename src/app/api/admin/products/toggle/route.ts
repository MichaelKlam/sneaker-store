import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, isActive } = await request.json();

    if (!productId || typeof isActive !== "boolean") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await prisma.product.update({
      where: { id: productId },
      data: { isActive },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Toggle product error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
