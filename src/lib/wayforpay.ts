import CryptoJS from "crypto-js";

export type WayForPayProduct = {
  name: string;
  count: number;
  price: number;
};

export type WayForPayCheckoutParams = {
  orderReference: string;
  orderDate: number; // unix timestamp
  amount: number;
  currency?: string;
  products: WayForPayProduct[];
  clientFirstName?: string;
  clientLastName?: string;
  clientEmail?: string;
  clientPhone?: string;
  language?: "UA" | "RU" | "EN";
  serviceUrl?: string; // webhook
  returnUrl?: string;  // куда вернуть после оплаты
};

/**
 * Генерирует подпись HMAC_MD5 для WayForPay
 * Согласно документации: merchantAccount;merchantDomainName;orderReference;orderDate;amount;currency;productName[0];...;productCount[0];...;productPrice[0];...
 */
export function generateSignature(
  merchantAccount: string,
  merchantDomainName: string,
  orderReference: string,
  orderDate: number,
  amount: number,
  currency: string,
  products: WayForPayProduct[],
  secretKey: string
): string {
  const productNames = products.map((p) => p.name);
  const productCounts = products.map((p) => p.count);
  const productPrices = products.map((p) => p.price);

  const signatureString = [
    merchantAccount,
    merchantDomainName,
    orderReference,
    orderDate,
    amount,
    currency,
    ...productNames,
    ...productCounts,
    ...productPrices,
  ].join(";");

  return CryptoJS.HmacMD5(signatureString, secretKey).toString();
}

/**
 * Создаёт объект полей для HTML-формы оплаты WayForPay
 */
export function createPaymentFormData(params: WayForPayCheckoutParams) {
  const merchantAccount = process.env.WAYFORPAY_MERCHANT_ACCOUNT!;
  const secretKey = process.env.WAYFORPAY_SECRET_KEY!;
  const merchantDomainName = process.env.WAYFORPAY_DOMAIN || "localhost:3000";

  const currency = params.currency || "UAH";
  const orderDate = params.orderDate || Math.floor(Date.now() / 1000);

  const merchantSignature = generateSignature(
    merchantAccount,
    merchantDomainName,
    params.orderReference,
    orderDate,
    params.amount,
    currency,
    params.products,
    secretKey
  );

  return {
    merchantAccount,
    merchantAuthType: "SimpleSignature",
    merchantDomainName,
    merchantSignature,
    orderReference: params.orderReference,
    orderDate,
    amount: params.amount,
    currency,
    productName: params.products.map((p) => p.name),
    productCount: params.products.map((p) => p.count),
    productPrice: params.products.map((p) => p.price),
    clientFirstName: params.clientFirstName || "",
    clientLastName: params.clientLastName || "",
    clientEmail: params.clientEmail || "",
    clientPhone: params.clientPhone || "",
    language: params.language || "UA",
    serviceUrl: params.serviceUrl || "",
    returnUrl: params.returnUrl || "",
    orderTimeout: 49000, // ~13.6 часов
  };
}

/**
 * Проверяет подпись входящего webhook от WayForPay
 */
export function verifyWebhookSignature(
  data: {
    merchantAccount: string;
    orderReference: string;
    amount: number;
    currency: string;
    authCode: string;
    cardPan: string;
    transactionStatus: string;
    reasonCode: string | number;
  },
  receivedSignature: string,
  secretKey: string
): boolean {
  const signatureString = [
    data.merchantAccount,
    data.orderReference,
    data.amount,
    data.currency,
    data.authCode,
    data.cardPan,
    data.transactionStatus,
    data.reasonCode,
  ].join(";");

  const calculated = CryptoJS.HmacMD5(signatureString, secretKey).toString();
  return calculated === receivedSignature;
}
