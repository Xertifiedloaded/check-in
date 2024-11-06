// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const response = NextResponse.next();

  if (token?.sub) {
    try {

      await fetch(`${request.nextUrl.origin}/api/users/online-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: token.sub,
          isOnline: true,
        }),
      });

      // Set last active cookie
      response.cookies.set('lastActive', Date.now().toString(), {
        path: '/',
        sameSite: 'strict',
      });
    } catch (error) {
      console.error('Error updating online status:', error);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};