"use client";

import { useTranslations } from "next-intl";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({
  className = "",
  size = "md",
  showText = true,
}: LogoProps) {
  const t = useTranslations("common");

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 text-primary-foreground"
          strokeWidth={2}
        >
          <path
            d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity={0.1}
          />
          <path
            d="M8 10L12 8L16 10"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 14L12 12L16 14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {showText && (
        <span
          className={`font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent ${textSizeClasses[size]}`}
        >
          {t("appName")}
        </span>
      )}
    </div>
  );
}
