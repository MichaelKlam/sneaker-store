import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminDashboard({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect(`/${locale}/admin/login`);
  }

  // Статистика
  const [productsCount, ordersCount, paidOrders, pendingOrders] =
    await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { paymentStatus: "PAID" } }),
      prisma.order.count({ where: { status: "PENDING" } }),
    ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {locale === "uk" ? "Панель керування" : "Панель управления"}
        </h1>
        <p className="text-gray-600">
          {locale === "uk"
            ? "Огляд магазину та швидкі дії"
            : "Обзор магазина и быстрые действия"}
        </p>
      </div>

      {/* Карточки статистики */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-6">
          <p className="text-sm text-gray-500 mb-1">
            {locale === "uk" ? "Активні товари" : "Активные товары"}
          </p>
          <p className="text-3xl font-bold">{productsCount}</p>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <p className="text-sm text-gray-500 mb-1">
            {locale === "uk" ? "Всього замовлень" : "Всего заказов"}
          </p>
          <p className="text-3xl font-bold">{ordersCount}</p>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <p className="text-sm text-gray-500 mb-1">
            {locale === "uk" ? "Оплачені" : "Оплаченные"}
          </p>
          <p className="text-3xl font-bold text-green-600">{paidOrders}</p>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <p className="text-sm text-gray-500 mb-1">
            {locale === "uk" ? "Очікують" : "Ожидают"}
          </p>
          <p className="text-3xl font-bold text-orange-500">{pendingOrders}</p>
        </div>
      </div>

      {/* Быстрые ссылки */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/products"
          className="px-5 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          {locale === "uk" ? "Керувати товарами" : "Управлять товарами"}
        </Link>
        <Link
          href="/admin/orders"
          className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          {locale === "uk" ? "Дивитися замовлення" : "Смотреть заказы"}
        </Link>
        <Link
          href="/products"
          className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          {locale === "uk" ? "Відкрити каталог" : "Открыть каталог"}
        </Link>
      </div>

      {/* Последние заказы */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold">
            {locale === "uk" ? "Останні замовлення" : "Последние заказы"}
          </h2>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {locale === "uk" ? "Замовлень поки немає" : "Заказов пока нет"}
          </div>
        ) : (
          <div className="divide-y">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="px-6 py-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-medium font-mono text-sm">
                    {order.orderNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.customerName} · {order.customerPhone}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {Number(order.total).toLocaleString("uk-UA")} ₴
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.paymentStatus} / {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
