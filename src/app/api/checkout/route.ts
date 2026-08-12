import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPaymentFormData } from "@/lib/wayforpay";
import { Prisma } from "@prisma/client";

type CheckoutBody = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerComment?: string;
  shippingCity?: string;
  shippingAddress?: string;
  shippingMethod?: string;
  locale: "uk" | "ru";
  items: {
    productId: string;
    size: string;
    quantity: number;
    price: number;
    nameUk: string;
    nameRu: string;
  }[];
};

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutBody = await request.json();

    // Валидация
    if (!body.customerName || !body.customerEmail || !body.customerPhone) {
      return NextResponse.json(
        { error: "Заполните обязательные поля" },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: "Корзина пуста" },
        { status: 400 }
      );
    }

    // Считаем суммы
    const subtotal = body.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingCost = 0; // пока бесплатно / рассчитывается отдельно
    const total = subtotal + shippingCost;

    // Генерируем номер заказа
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Создаём заказ в базе
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        customerComment: body.customerComment || null,
        shippingCity: body.shippingCity || null,
        shippingAddress: body.shippingAddress || null,
        shippingMethod: body.shippingMethod || "nova_poshta",
        status: "PENDING",
        paymentStatus: "PENDING",
        paymentMethod: "wayforpay",
        subtotal: new Prisma.Decimal(subtotal),
        shippingCost: new Prisma.Decimal(shippingCost),
        total: new Prisma.Decimal(total),
        items: {
          create: body.items.map((item) => ({
            productId: item.productId,
            productName: body.locale === "uk" ? item.nameUk : item.nameRu,
            size: item.size,
            quantity: item.quantity,
            price: new Prisma.Decimal(item.price),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Формируем данные для WayForPay
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const paymentData = createPaymentFormData({
      orderReference: order.orderNumber,
      orderDate: Math.floor(Date.now() / 1000),
      amount: total,
      currency: "UAH",
      products: body.items.map((item) => ({
        name: body.locale === "uk" ? item.nameUk : item.nameRu,
        count: item.quantity,
        price: item.price,
      })),
      clientFirstName: body.customerName.split(" ")[0] || body.customerName,
      clientLastName: body.customerName.split(" ").slice(1).join(" ") || "",
      clientEmail: body.customerEmail,
      clientPhone: body.customerPhone,
      language: body.locale === "uk" ? "UA" : "RU",
      serviceUrl: `${baseUrl}/api/wayforpay/webhook`,
      returnUrl: `${baseUrl}/${body.locale}/checkout/success?order=${order.orderNumber}`,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentData,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Ошибка при создании заказа" },
      { status: 500 }
    );
  }
}
