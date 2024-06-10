import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function middleware (request: NextRequest): NextResponse  {
    return checkPath(request);
}

const checkPath = (request: NextRequest) : NextResponse => {
    // let response: NextResponse<unknown> = NextResponse.next();

    // if (request.nextUrl.pathname.startsWith("/")) {
    //     response = NextResponse.next();
    // }

    // if (!request.nextUrl.pathname.startsWith("/")) {
    //     response = NextResponse.redirect(new URL("/404", request.url));
    // }

    // return response;

    if (request.nextUrl.pathname.startsWith("/") || request.nextUrl.pathname.startsWith("/404")) {
        return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/404", request.url));
}

export const config = {
    matcher: "/:path",
};

export default middleware;