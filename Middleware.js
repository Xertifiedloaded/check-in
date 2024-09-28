import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req) {
  const path = req.nextUrl.pathname
  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const publicPath = path === "/" || path === "/auth/signup"

  if (publicPath && token) {
    return NextResponse.redirect(new URL("/profile/edit", req.url))
  }
  if (publicPath && !token) {
    return NextResponse.redirect(new URL("/", req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/auth/signup", "/profile/edit"],
}
