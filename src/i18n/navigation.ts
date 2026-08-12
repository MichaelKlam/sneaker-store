import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Эти компоненты и хуки автоматически учитывают текущий язык
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
