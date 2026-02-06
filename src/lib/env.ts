/**
 * Public env config. All keys must use NEXT_PUBLIC_ so they are available
 * in both server and client components.
 */

export const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "YourAppName",
  whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "",
  telegramUrl: process.env.NEXT_PUBLIC_TELEGRAM_URL ?? "",
  appDeepLink: process.env.NEXT_PUBLIC_APP_DEEP_LINK ?? "",
  appStoreUrl: process.env.NEXT_PUBLIC_APP_STORE_URL ?? "",
  playStoreUrl: process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? "",
} as const;
