import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Basit middleware - locale'yi cookie'den oku ve header'a ekle
  const locale = request.cookies.get("NEXT_LOCALE")?.value || "tr";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
