import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // !?8A>: ?>445@68205<KE O7K:>2
  locales: ["uk", "ru"],

  // /7K: ?> C<>;G0=8N (C:@08=A:89)
  defaultLocale: "uk",

  // A5340 ?>:07K20BL ?@5D8:A O7K:0 2 URL (/uk/..., /ru/...)
  // -B> ;CGH5 4;O SEO 8 :MH8@>20=8O
  localePrefix: "always"
});
