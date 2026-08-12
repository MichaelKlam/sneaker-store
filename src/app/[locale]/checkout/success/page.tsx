import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string }>;
};

export default async function CheckoutSuccessPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { order } = await searchParams;

  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-lg">
      <div className="text-6xl mb-6">✅</div>
      <h1 className="text-3xl font-bold mb-4">
        {locale === "uk" ? "Дякуємо за замовлення!" : "Спасибо за заказ!"}
      </h1>

      {order && (
        <p className="text-gray-600 mb-2">
          {locale === "uk" ? "Номер замовлення:" : "Номер заказа:"}{" "}
          <span className="font-mono font-medium">{order}</span>
        </p>
      )}

      <p className="text-gray-600 mb-8">
        {locale === "uk"
          ? "Ми надішлемо підтвердження на вашу електронну пошту після успішної оплати."
          : "Мы отправим подтверждение на вашу электронную почту после успешной оплаты."}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/products"
          className="px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          {locale === "uk" ? "Продовжити покупки" : "Продолжить покупки"}
        </Link>
        <Link
          href="/"
          className="px-8 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          {locale === "uk" ? "На головну" : "На главную"}
        </Link>
      </div>
    </div>
  );
}
