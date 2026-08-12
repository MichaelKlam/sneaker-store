import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_COOKIE_NAME = "admin_session";

export function createSessionToken(password: string): string {
  const secret =
    process.env.ADMIN_SECRET ||
    process.env.WAYFORPAY_SECRET_KEY ||
    "fallback-secret";
  return crypto
    .createHmac("sha256", secret)
    .update(`admin:${password}`)
    .digest("hex");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) return false;

  const correctPassword = process.env.ADMIN_PASSWORD;
  if (!correctPassword) return false;

  const expectedToken = createSessionToken(correctPassword);
  return token === expectedToken;
}
