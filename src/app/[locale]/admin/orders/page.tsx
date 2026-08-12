import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import UpdateOrderStatus from "@/components/admin/UpdateOrderStatus";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminOrdersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect(`/${locale}/admin/login`);
  }

  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {locale === "uk" ? "Замовлення" : "Заказы"}
        </h1>
        <p className="text-gray-600 text-sm">
          {orders.length} {locale === "uk" ? "замовлень" : "заказов"}
        </p>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
            {locale === "uk" ? "Замовлень поки немає" : "Заказов пока нет"}
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border rounded-xl p-5 space-y-4"
            >
              {/* Шапка заказа */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString(
                      locale === "uk" ? "uk-UA" : "ru-RU"
                    )}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold">
                    {Number(order.total).toLocaleString("uk-UA")} ₴
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.paymentMethod} · {order.paymentStatus}
                  </p>
                </div>
              </div>

              {/* Клиент */}
              <div className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-500">
                    {locale === "uk" ? "Клієнт:" : "Клиент:"}
                  </span>{" "}
                  {order.customerName}
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>{" "}
                  {order.customerEmail}
                </div>
                <div>
                  <span className="text-gray-500">
                    {locale === "uk" ? "Телефон:" : "Телефон:"}
                  </span>{" "}
                  {order.customerPhone}
                </div>
                {order.shippingCity && (
                  <div>
                    <span className="text-gray-500">
                      {locale === "uk" ? "Місто:" : "Город:"}
                    </span>{" "}
                    {order.shippingCity}
                    {order.shippingAddress && `, ${order.shippingAddress}`}
                  </div>
                )}
              </div>

              {/* Товары */}
              <div className="border-t pt-3">
                <p className="text-xs text-gray-500 mb-2">
                  {locale === "uk" ? "Товари:" : "Товары:"}
                </p>
                <ul className="text-sm space-y-1">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-4">
                      <span>
                        {item.productName}
                        {item.size && ` (${item.size})`} × {item.quantity}
                      </span>
                      <span className="text-gray-600">
                        {(Number(item.price) * item.quantity).toLocaleString(
                          "uk-UA"
                        )}{" "}
                        ₴
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Статус */}
              <div className="border-t pt-3 flex items-center justify-between gap-4">
                <div className="text-sm">
                  <span className="text-gray-500">
                    {locale === "uk" ? "Статус замовлення:" : "Статус заказа:"}
                  </span>
                </div>
                <UpdateOrderStatus
                  orderId={order.id}
                  currentStatus={order.status}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
