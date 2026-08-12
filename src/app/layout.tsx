import type { ReactNode } from "react";
import "./globals.css";

// Корневой layout — минимальный.
// Вся логика локализации находится в [locale]/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
