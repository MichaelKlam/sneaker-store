"use client";

import { useRouter } from "@/i18n/navigation";

type Props = {
  locale: string;
};

export default function AdminLogoutButton({ locale }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-red-500 hover:text-red-700 transition-colors"
    >
      {locale === "uk" ? "Вийти" : "Выйти"}
    </button>
  );
}
