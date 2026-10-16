import { NextResponse, type NextRequest } from "next/server";

// Runs before every page request. Two jobs, both visible from the outside so the check can see it ran:
// a response header naming the template, and a redirect from /home to /.
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/home") return NextResponse.redirect(new URL("/", request.url));
  const response = NextResponse.next();
  response.headers.set("x-verify-middleware", "ran");
  response.headers.set("x-content-type-options", "nosniff");
  response.headers.set("referrer-policy", "strict-origin-when-cross-origin");
  return response;
}

// Pages only: skip Next's own assets and files with an extension.
export const config = { matcher: ["/((?!_next/|.*\\..*).*)"] };
