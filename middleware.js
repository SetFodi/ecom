// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Constants
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const publicRoutes = ["/", "/login", "/register", "/products", "/cart", "/checkout"];

export async function middleware(request) {
  // Check if the route is public
  const path = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
  
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Get the token from cookies
  const token = request.cookies.get("auth_token")?.value;

  // If there's no token and the route is protected
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verify token
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return NextResponse.next();
  } catch (error) {
    // Token is invalid, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Configure which routes this middleware is applied to
export const config = {
  matcher: [
    "/account/:path*",
    "/api/auth/me",
    "/api/orders/:path*",
  ],
};