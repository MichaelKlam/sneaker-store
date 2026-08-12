import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import ToggleProductActive from "@/components/admin/ToggleProductActive";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminProductsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect(`/${locale}/admin/login`);
  }

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {locale === "uk" ? "Товари" : "Товары"}
          </h1>
          <p className="text-gray-600 text-sm">
            {products.length} {locale === "uk" ? "позицій" : "позиций"}
          </p>
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  {locale === "uk" ? "Назва" : "Название"}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  {locale === "uk" ? "Категорія" : "Категория"}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  {locale === "uk" ? "Ціна" : "Цена"}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  {locale === "uk" ? "Залишок" : "Остаток"}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  {locale === "uk" ? "Статус" : "Статус"}
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">
                  {locale === "uk" ? "Дії" : "Действия"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => {
                const name = locale === "uk" ? product.nameUk : product.nameRu;
                const categoryName =
                  locale === "uk"
                    ? product.category.nameUk
                    : product.category.nameRu;

                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium line-clamp-1 max-w-xs">
                        {name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.brand}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{categoryName}</td>
                    <td className="px-4 py-3 font-medium">
                      {Number(product.price).toLocaleString("uk-UA")} ₴
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          product.stock <= 5
                            ? "text-orange-600 font-medium"
                            : ""
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ToggleProductActive
                        productId={product.id}
                        isActive={product.isActive}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/products/${product.slug}`}
                        className="text-sm text-gray-500 hover:text-black"
                        target="_blank"
                      >
                        {locale === "uk" ? "Переглянути" : "Посмотреть"}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
