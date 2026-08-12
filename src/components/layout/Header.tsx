"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const t = useTranslations("Common");
  const { totalItems, isReady } = useCart();

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Логотип */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          SneakerStore
        </Link>

        {/* Навигация */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-gray-600 transition-colors">
            {t("home")}
          </Link>
          <Link href="/products" className="hover:text-gray-600 transition-colors">
            {t("catalog")}
          </Link>
          <Link href="/cart" className="hover:text-gray-600 transition-colors">
            {t("cart")}
          </Link>
        </nav>

        {/* Переключатель языка + корзина */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          <Link
            href="/cart"
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={t("cart")}
          >
            <span className="text-lg">🛒</span>
            {isReady && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
