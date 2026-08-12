import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/wayforpay";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      merchantAccount,
      orderReference,
      amount,
      currency,
      authCode,
      cardPan,
      transactionStatus,
      reasonCode,
      merchantSignature,
    } = body;

    // Проверяем подпись
    const secretKey = process.env.WAYFORPAY_SECRET_KEY!;
    const isValid = verifyWebhookSignature(
      {
        merchantAccount,
        orderReference,
        amount,
        currency,
        authCode: authCode || "",
        cardPan: cardPan || "",
        transactionStatus,
        reasonCode,
      },
      merchantSignature,
      secretKey
    );

    if (!isValid) {
      console.error("Invalid WayForPay signature", orderReference);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Находим заказ
    const order = await prisma.order.findUnique({
      where: { orderNumber: orderReference },
    });

    if (!order) {
      console.error("Order not found:", orderReference);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Обновляем статус в зависимости от ответа WayForPay
    if (transactionStatus === "Approved") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          status: "CONFIRMED",
          paymentId: authCode || null,
        },
      });
    } else if (
      transactionStatus === "Declined" ||
      transactionStatus === "Expired"
    ) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "FAILED",
        },
      });
    }

    // WayForPay ожидает специальный ответ
    // Согласно документации нужно вернуть подтверждение
    const time = Math.floor(Date.now() / 1000);
    const responseSignature = require("crypto-js")
      .HmacMD5(`${orderReference};accept;${time}`, secretKey)
      .toString();

    return NextResponse.json({
      orderReference,
      status: "accept",
      time,
      signature: responseSignature,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
