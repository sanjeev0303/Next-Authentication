
/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const PublicRoutes: string[] = [
    "/",
    "/auth/new-verification",
    "/auth/new-password",
]


/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings page
 * @type {string[]}
 */

export  const authRoutes: string[] = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset"
]



/**
 * The prefix for API authentication roues 
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */

export const apiAuthPrefix: string = "/api/auth";

/**
 * The default redirect path after loggin in 
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT: string = "/settings"