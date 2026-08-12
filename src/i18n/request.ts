import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // >;CG05< O7K: 87 URL
  const requested = await requestLocale;

  // @>25@O5<, ?>445@68205BAO ;8 O7K:. A;8 =5B  8A?>;L7C5< C:@08=A:89
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    // 03@C605< D09; ?5@52>4>2
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
