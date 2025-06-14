import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

const locales = ["tr", "en"] as const;

export default getRequestConfig(async ({ locale }) => {
  const headersList = await headers();
  const headerLocale = headersList.get("x-locale");

  const finalLocale = headerLocale || locale || "tr";

  const validLocale = (
    locales.includes(finalLocale as (typeof locales)[number])
      ? finalLocale
      : "tr"
  ) as string;

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});
