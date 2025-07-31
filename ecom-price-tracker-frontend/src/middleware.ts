import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protect only specific paths
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/alerts/:path*"],
};

export default withAuth(
  function middleware(req: NextRequest) {
    const session = (req as any).nextauth?.token;

    if (!session) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const now = Date.now();
    const expires = new Date(session.exp! * 1000);

    if (expires.getTime() < now) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // authorized: ({ token }) => !!token, // simple auth check
      authorized: () => true, // always allow access, you can customize this logic
    },
  }
);
