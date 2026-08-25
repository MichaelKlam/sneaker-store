import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["uk", "ru"],
  defaultLocale: "uk",
  localePrefix: "always",
  localeDetection: false, // отключаем автоопределение языка браузера
});