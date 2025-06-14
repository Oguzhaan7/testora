"use client";

import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";

interface IntlProviderProps {
  children: ReactNode;
  locale: string;
  messages: IntlMessages;
}

export function IntlProvider({
  children,
  locale,
  messages,
}: IntlProviderProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

// Type for the messages structure
interface IntlMessages {
  [key: string]: unknown;
}
