const UNAUTHORIZED_RESPONSE = new Response("Authentication required.", {
    status: 401,
    headers: {
        "WWW-Authenticate": 'Basic realm="Protected Area"',
    },
});

function decodeBase64(value: string): string {
    try {
        return atob(value);
    } catch (_error) {
        return "";
    }
}

function isAuthorized(request: Request): boolean {
    const expectedUsername = process.env.BASIC_AUTH_USERNAME?.trim();
    const expectedPassword = process.env.BASIC_AUTH_PASSWORD?.trim();

    if (!expectedUsername || !expectedPassword) {
        return true;
    }

    const authorizationHeader = request.headers.get("authorization");
    if (!authorizationHeader?.startsWith("Basic ")) {
        return false;
    }

    const base64Credentials = authorizationHeader.slice("Basic ".length).trim();
    const decodedCredentials = decodeBase64(base64Credentials);
    const separatorIndex = decodedCredentials.indexOf(":");

    if (separatorIndex === -1) {
        return false;
    }

    const providedUsername = decodedCredentials.slice(0, separatorIndex);
    const providedPassword = decodedCredentials.slice(separatorIndex + 1);

    return providedUsername === expectedUsername && providedPassword === expectedPassword;
}

export default function middleware(request: Request) {
    if (!isAuthorized(request)) {
        return UNAUTHORIZED_RESPONSE;
    }

    return;
}
