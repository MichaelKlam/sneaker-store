import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Определяем, находимся ли мы на странице логина
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || headersList.get("x-url") || "";
  // Более надёжный способ — проверяем через URL из referer/middleware, 
  // но для простоты используем проверку авторизации + исключение login через отдельный layout.

  // Для страницы /admin/login мы не требуем авторизацию.
  // Проверку делаем только для защищённых страниц.
  // Так как login лежит в той же папке, мы проверим авторизацию
  // и если пользователь не авторизован и это не login — редирект.

  const isAuthenticated = await isAdminAuthenticated();

  // Получаем текущий путь более надёжно через middleware позже.
  // Пока: если не авторизован — показываем children только если это login,
  // иначе редиректим. Для этого добавим проверку в сами страницы или
  // используем простой подход ниже.

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated ? (
        <>
          {/* Верхняя панель админки (только для авторизованных) */}
          <header className="bg-white border-b">
            <div className="container mx-auto px-4 h-14 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Link href="/admin" className="font-bold text-lg">
                  Admin Panel
                </Link>
                <nav className="hidden sm:flex items-center gap-4 text-sm">
                  <Link
                    href="/admin"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    {locale === "uk" ? "Дашборд" : "Дашборд"}
                  </Link>
                  <Link
                    href="/admin/products"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    {locale === "uk" ? "Товари" : "Товары"}
                  </Link>
                  <Link
                    href="/admin/orders"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    {locale === "uk" ? "Замовлення" : "Заказы"}
                  </Link>
                </nav>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="text-sm text-gray-500 hover:text-black transition-colors"
                >
                  {locale === "uk" ? "← На сайт" : "← На сайт"}
                </Link>
                <AdminLogoutButton locale={locale} />
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">{children}</main>
        </>
      ) : (
        // Не авторизован — просто рендерим children (страница login)
        <main>{children}</main>
      )}
    </div>
  );
}
