import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import AddToCartButton from "@/components/product/AddToCartButton";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Product");
  const tCatalog = await getTranslations("Catalog");
  const tCommon = await getTranslations("Common");

  // Получаем товар
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  // Локализованные поля
  const name = locale === "uk" ? product.nameUk : product.nameRu;
  const description =
    locale === "uk" ? product.descriptionUk : product.descriptionRu;
  const color = locale === "uk" ? product.colorUk : product.colorRu;
  const categoryName =
    locale === "uk" ? product.category.nameUk : product.category.nameRu;

  const price = Number(product.price);
  const oldPrice = product.oldPrice ? Number(product.oldPrice) : null;
  const hasDiscount = oldPrice && oldPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((oldPrice! - price) / oldPrice!) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Хлебные крошки */}
      <nav className="mb-8 text-sm text-gray-500">
        <ol className="flex items-center gap-2 flex-wrap">
          <li>
            <Link href="/" className="hover:text-black transition-colors">
              {tCommon("home")}
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/products" className="hover:text-black transition-colors">
              {tCommon("catalog")}
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-black transition-colors"
            >
              {categoryName}
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium truncate max-w-[200px]">
            {name}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Галерея изображений */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
            <span className="text-9xl">👟</span>
          </div>

          {/* Миниатюры (заглушки) */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-2xl"
                >
                  👟
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Информация о товаре */}
        <div className="space-y-6">
          {/* Бренд и название */}
          <div>
            {product.brand && (
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">
                {product.brand}
              </p>
            )}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {name}
            </h1>
          </div>

          {/* Цена */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">
              {price.toLocaleString("uk-UA")} ₴
            </span>
            {hasDiscount && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  {oldPrice!.toLocaleString("uk-UA")} ₴
                </span>
                <span className="bg-red-500 text-white text-sm font-bold px-2.5 py-1 rounded">
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Наличие */}
          <div>
            {product.stock > 0 ? (
              <p className="text-green-600 font-medium">
                {tCatalog("inStock")}
                {product.stock <= 5 && (
                  <span className="text-orange-600 ml-2">
                    ({locale === "uk" ? `залишилось ${product.stock}` : `осталось ${product.stock}`})
                  </span>
                )}
              </p>
            ) : (
              <p className="text-red-500 font-medium">{tCatalog("outOfStock")}</p>
            )}
          </div>

          {/* Цвет */}
          {color && (
            <div>
              <p className="text-sm text-gray-500 mb-1">{t("color")}</p>
              <p className="font-medium">{color}</p>
            </div>
          )}

          {/* Выбор размера + кнопка "Додати в кошик" */}
          <AddToCartButton
            product={{
              id: product.id,
              slug: product.slug,
              nameUk: product.nameUk,
              nameRu: product.nameRu,
              price: Number(product.price),
              images: product.images,
              brand: product.brand,
              sizes: product.sizes,
              stock: product.stock,
            }}
          />

          {/* Описание */}
          {description && (
            <div className="pt-6 border-t">
              <h2 className="font-semibold mb-3">{t("description")}</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>
          )}

          {/* Дополнительная информация */}
          <div className="pt-4 text-sm text-gray-500 space-y-1">
            <p>
              {locale === "uk" ? "Категорія" : "Категория"}:{" "}
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-gray-900 hover:underline"
              >
                {categoryName}
              </Link>
            </p>
            {product.brand && (
              <p>
                {locale === "uk" ? "Бренд" : "Бренд"}: {product.brand}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
