"use client";

import { QueryProvider } from "./QueryProvider";
import { AuthProvider } from "./AuthProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./ToastProvider";
import { IntlProvider } from "./IntlProvider";

interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
  messages: { [key: string]: unknown };
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <ThemeProvider>
      <IntlProvider locale={locale} messages={messages}>
        <QueryProvider>
          <AuthProvider>
            {children}
            <ToastProvider />
          </AuthProvider>
        </QueryProvider>
      </IntlProvider>
    </ThemeProvider>
  );
}
