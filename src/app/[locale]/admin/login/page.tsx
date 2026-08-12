"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function AdminLoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Неверный пароль");
        setLoading(false);
        return;
      }

      // Успешный вход — перенаправляем в админку
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError("Ошибка сервера");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Admin Panel</h1>
          <p className="text-gray-500 text-sm">
            {locale === "uk"
              ? "Введіть пароль для доступу"
              : "Введите пароль для доступа"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm"
        >
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              {locale === "uk" ? "Пароль" : "Пароль"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-black"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading
              ? locale === "uk"
                ? "Перевірка..."
                : "Проверка..."
              : locale === "uk"
              ? "Увійти"
              : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
