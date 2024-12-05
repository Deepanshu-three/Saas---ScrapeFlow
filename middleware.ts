import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  } else {
  }
});

export const config = {
  matcher: [
    // Match all application pages except static files and Next.js internals
    '/((?!_next|static|favicon.ico).*)',
    // Explicitly match the dynamic workflow editor route
    '/workflow/editor/:path*',
    // Always include API routes
    '/api/:path*',
  ],
};
