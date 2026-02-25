import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;
    if(pathname === "/"){
    return NextResponse.redirect(new URL("/public", request.url));
    }
    if(pathname === "/admin/dashboard/"){
    const cookieStore = cookies();
    const token = cookieStore.get("access_token");
    if(!token){
        return NextResponse.redirect(new URL("/login", request.url));
    }
   }
   return NextResponse.next();
   
}

export const config = {
  matcher: ["/"],
};