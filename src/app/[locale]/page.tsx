import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Catalog");
  const tCommon = await getTranslations("Common");

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {t("title")}
        </h1>

        <p className="text-lg text-gray-600">
          {locale === "uk"
            ? "Ласкаво просимо до магазину якісних кросівок. Оберіть свою пару вже сьогодні."
            : "Добро пожаловать в магазин качественных кроссовок. Выберите свою пару уже сегодня."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            {tCommon("catalog")}
          </Link>

          <Link
            href="/cart"
            className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            {tCommon("cart")}
          </Link>
        </div>

        {/* Временный блок — потом заменим на реальные товары */}
        <div className="mt-16 p-6 bg-gray-50 rounded-xl text-left">
          <h2 className="font-semibold mb-2">Статус проекта</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✅ Next.js + TypeScript</li>
            <li>✅ next-intl (uk / ru)</li>
            <li>✅ Переключатель языков</li>
            <li>⏳ Prisma + база данных</li>
            <li>⏳ Каталог товаров</li>
            <li>⏳ WayForPay</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
