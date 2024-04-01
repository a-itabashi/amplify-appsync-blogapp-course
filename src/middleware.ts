import { NextRequest, NextResponse } from "next/server";
import { getAuthenticated } from "@/utils/amplifyServerUtils";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.nextUrl.pathname === "/") {
    return response;
  }
  //   if (request.nextUrl.pathname.startsWith("/posts")) {
  //     return response;
  //   }

  const authenticated = await getAuthenticated({
    request,
    response,
  });

  if (authenticated) {
    return response;
  }

  //   return NextResponse.redirect(new URL("/sign-in", request.url));
  return NextResponse.redirect(new URL("/profile", request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    // "/((?!api|_next/static|_next/image|favicon.ico|sign-in).*)",
    // "/((?!api|_next/static|_next/image|favicon.ico|profile).*)",
    "/((?!api|_next/static|_next/image|favicon.ico|profile).*)",
  ],
};
