"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale(); // текущий язык: "uk" или "ru"
  const router = useRouter();
  const pathname = usePathname(); // текущий путь без префикса языка
  const [isPending, startTransition] = useTransition();

  function switchLocale(nextLocale: "uk" | "ru") {
    // Меняем язык, оставаясь на той же странице
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        onClick={() => switchLocale("uk")}
        disabled={isPending}
        className={`px-2 py-1 rounded transition-colors ${
          locale === "uk"
            ? "bg-black text-white font-medium"
            : "text-gray-600 hover:text-black"
        }`}
      >
        UA
      </button>

      <span className="text-gray-300">|</span>

      <button
        onClick={() => switchLocale("ru")}
        disabled={isPending}
        className={`px-2 py-1 rounded transition-colors ${
          locale === "ru"
            ? "bg-black text-white font-medium"
            : "text-gray-600 hover:text-black"
        }`}
      >
        RU
      </button>
    </div>
  );
}
