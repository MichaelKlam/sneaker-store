"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCart } from "@/context/CartContext";
import { Link } from "@/i18n/navigation";

export default function CheckoutPage() {
  const t = useTranslations("Cart");
  const locale = useLocale() as "uk" | "ru";
  const router = useRouter();
  const { items, totalPrice, totalItems, clearCart, isReady } = useCart();

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerComment: "",
    shippingCity: "",
    shippingAddress: "",
    shippingMethod: "nova_poshta",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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
        <h1 className="text-2xl font-bold mb-4">
          {locale === "uk" ? "Кошик порожній" : "Корзина пуста"}
        </h1>
        <Link
          href="/products"
          className="inline-block mt-4 px-6 py-3 bg-black text-white rounded-xl"
        >
          {t("continueShopping")}
        </Link>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          locale,
          items: items.map((item) => ({
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            nameUk: item.nameUk,
            nameRu: item.nameRu,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при создании заказа");
      }

      // Создаём и отправляем форму на WayForPay
      const formEl = document.createElement("form");
      formEl.method = "POST";
      formEl.action = "https://secure.wayforpay.com/pay";
      formEl.acceptCharset = "utf-8";

      const paymentData = data.paymentData;

      // Добавляем все поля
      Object.entries(paymentData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = `${key}[]`;
            input.value = String(v);
            formEl.appendChild(input);
          });
        } else {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          formEl.appendChild(input);
        }
      });

      document.body.appendChild(formEl);

      // Очищаем корзину перед редиректом
      clearCart();

      formEl.submit();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Произошла ошибка");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">
        {locale === "uk" ? "Оформлення замовлення" : "Оформление заказа"}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Форма */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-lg">
              {locale === "uk" ? "Контактні дані" : "Контактные данные"}
            </h2>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                {locale === "uk" ? "Ім'я та прізвище *" : "Имя и фамилия *"}
              </label>
              <input
                type="text"
                name="customerName"
                required
                value={form.customerName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  required
                  value={form.customerEmail}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {locale === "uk" ? "Телефон *" : "Телефон *"}
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  required
                  placeholder="+380..."
                  value={form.customerPhone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-lg">
              {locale === "uk" ? "Доставка" : "Доставка"}
            </h2>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                {locale === "uk" ? "Місто" : "Город"}
              </label>
              <input
                type="text"
                name="shippingCity"
                value={form.shippingCity}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                {locale === "uk" ? "Адреса / Відділення Нової Пошти" : "Адрес / Отделение Новой Почты"}
              </label>
              <input
                type="text"
                name="shippingAddress"
                value={form.shippingAddress}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                {locale === "uk" ? "Спосіб доставки" : "Способ доставки"}
              </label>
              <select
                name="shippingMethod"
                value={form.shippingMethod}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-black"
              >
                <option value="nova_poshta">
                  {locale === "uk" ? "Нова Пошта" : "Новая Почта"}
                </option>
                <option value="ukrposhta">
                  {locale === "uk" ? "Укрпошта" : "Укрпочта"}
                </option>
                <option value="self">
                  {locale === "uk" ? "Самовивіз" : "Самовывоз"}
                </option>
              </select>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-6">
            <label className="block text-sm text-gray-600 mb-1">
              {locale === "uk" ? "Коментар до замовлення" : "Комментарий к заказу"}
            </label>
            <textarea
              name="customerComment"
              rows={3}
              value={form.customerComment}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-black"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {isSubmitting
              ? locale === "uk"
                ? "Створюємо замовлення..."
                : "Создаём заказ..."
              : locale === "uk"
              ? "Оплатити через WayForPay"
              : "Оплатить через WayForPay"}
          </button>
        </form>

        {/* Итого */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-lg">{t("total")}</h2>

            <div className="space-y-3 max-h-64 overflow-y-auto text-sm">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex justify-between gap-2">
                  <span className="text-gray-600 line-clamp-1">
                    {(locale === "uk" ? item.nameUk : item.nameRu)} × {item.quantity}
                  </span>
                  <span className="font-medium whitespace-nowrap">
                    {(item.price * item.quantity).toLocaleString("uk-UA")} ₴
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {locale === "uk" ? "Товари" : "Товары"} ({totalItems})
                </span>
                <span>{totalPrice.toLocaleString("uk-UA")} ₴</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>{t("total")}</span>
                <span>{totalPrice.toLocaleString("uk-UA")} ₴</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
