"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const t = useTranslations("Cart");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const {
    items,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
    clearCart,
    isReady,
  } = useCart();

  if (!isReady) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold mb-3">{t("title")}</h1>
        <p className="text-gray-600 mb-8">{t("empty")}</p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center px-8 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
        >
          {t("continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          {t("title")} ({totalItems})
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          {locale === "uk" ? "Очистити кошик" : "Очистить корзину"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Список товаров */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const name = locale === "uk" ? item.nameUk : item.nameRu;

            return (
              <div
                key={`${item.productId}-${item.size}`}
                className="flex gap-4 p-4 border border-gray-200 rounded-xl"
              >
                {/* Изображение */}
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                  👟
                </div>

                {/* Информация */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-4">
                    <div>
                      {item.brand && (
                        <p className="text-xs text-gray-500 uppercase">
                          {item.brand}
                        </p>
                      )}
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-medium hover:underline line-clamp-2"
                      >
                        {name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        {locale === "uk" ? "Розмір" : "Размер"}: {item.size}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                    >
                      {t("remove")}
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Количество */}
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.quantity - 1
                          )
                        }
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.quantity + 1
                          )
                        }
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Цена */}
                    <div className="text-right">
                      <p className="font-bold">
                        {(item.price * item.quantity).toLocaleString("uk-UA")} ₴
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-500">
                          {item.price.toLocaleString("uk-UA")} ₴ / шт
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Итого */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-lg">{t("total")}</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {locale === "uk" ? "Товари" : "Товары"} ({totalItems})
                </span>
                <span>{totalPrice.toLocaleString("uk-UA")} ₴</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {locale === "uk" ? "Доставка" : "Доставка"}
                </span>
                <span className="text-gray-500">
                  {locale === "uk" ? "Розраховується далі" : "Рассчитывается далее"}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>{t("total")}</span>
                <span>{totalPrice.toLocaleString("uk-UA")} ₴</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full text-center bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              {t("checkout")}
            </Link>

            <Link
              href="/products"
              className="block w-full text-center text-sm text-gray-600 hover:text-black transition-colors py-2"
            >
              {t("continueShopping")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
