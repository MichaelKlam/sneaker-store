import { getTranslations, setRequestLocale, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Catalog");
  const tCommon = await getTranslations("Common");

  // Получаем параметры фильтрации (пока базовые)
  const resolvedSearchParams = await searchParams;
  const categorySlug = typeof resolvedSearchParams.category === "string"
    ? resolvedSearchParams.category
    : undefined;

  // Загружаем категории
  const categories = await prisma.category.findMany({
    orderBy: { nameUk: "asc" },
  });

  // Загружаем товары
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(categorySlug
        ? { category: { slug: categorySlug } }
        : {}),
    },
    include: {
      category: true,
    },
    orderBy: [
      { isFeatured: "desc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          {t("title")}
        </h1>
        <p className="text-gray-600">
          {locale === "uk"
            ? `Знайдено ${products.length} товарів`
            : `Найдено ${products.length} товаров`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Боковая панель с категориями */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div>
              <h2 className="font-semibold mb-3 text-sm uppercase tracking-wide text-gray-500">
                {t("filters")}
              </h2>

              <nav className="space-y-1">
                <Link
                  href="/products"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    !categorySlug
                      ? "bg-black text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {locale === "uk" ? "Всі категорії" : "Все категории"}
                </Link>

                {categories.map((category) => {
                  const name = locale === "uk" ? category.nameUk : category.nameRu;
                  const isActive = categorySlug === category.slug;

                  return (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.slug}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? "bg-black text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </aside>

        {/* Сетка товаров */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              {locale === "uk"
                ? "Товарів у цій категорії поки немає"
                : "Товаров в этой категории пока нет"}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
