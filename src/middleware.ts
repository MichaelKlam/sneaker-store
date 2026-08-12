import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Применяем middleware ко всем путям, кроме API, статики и файлов
  matcher: ["/((?!api|_next|.*\\..*).*)"]
};
