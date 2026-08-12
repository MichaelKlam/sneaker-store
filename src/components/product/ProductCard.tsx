import { Link } from "@/i18n/navigation";
import { Prisma } from "@prisma/client";

type ProductWithCategory = {
  id: string;
  slug: string;
  nameUk: string;
  nameRu: string;
  price: Prisma.Decimal;
  oldPrice: Prisma.Decimal | null;
  images: string[];
  brand: string | null;
  isFeatured: boolean;
  stock: number;
};

type Props = {
  product: ProductWithCategory;
  locale: string;
};

export default function ProductCard({ product, locale }: Props) {
  const name = locale === "uk" ? product.nameUk : product.nameRu;
  const price = Number(product.price);
  const oldPrice = product.oldPrice ? Number(product.oldPrice) : null;
  const hasDiscount = oldPrice && oldPrice > price;
  const image = product.images[0] || "/images/sneakers/placeholder-1.jpg";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Изображение */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
          {/* Пока заглушка. Позже заменим на next/image */}
          <span className="text-6xl">👟</span>
        </div>

        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{Math.round(((oldPrice! - price) / oldPrice!) * 100)}%
          </span>
        )}

        {product.isFeatured && (
          <span className="absolute top-3 right-3 bg-black text-white text-xs font-medium px-2 py-1 rounded">
            {locale === "uk" ? "Топ" : "Топ"}
          </span>
        )}
      </div>

      {/* Информация */}
      <div className="p-4 space-y-2">
        {product.brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {product.brand}
          </p>
        )}

        <h3 className="font-medium text-gray-900 group-hover:text-black line-clamp-2 leading-snug">
          {name}
        </h3>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold">
            {price.toLocaleString("uk-UA")} ₴
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {oldPrice!.toLocaleString("uk-UA")} ₴
            </span>
          )}
        </div>

        {product.stock <= 5 && product.stock > 0 && (
          <p className="text-xs text-orange-600">
            {locale === "uk" ? `Залишилось ${product.stock}` : `Осталось ${product.stock}`}
          </p>
        )}

        {product.stock === 0 && (
          <p className="text-xs text-red-500">
            {locale === "uk" ? "Немає в наявності" : "Нет в наличии"}
          </p>
        )}
      </div>
    </Link>
  );
}
