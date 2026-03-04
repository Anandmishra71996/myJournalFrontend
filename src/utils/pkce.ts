/**
 * PKCE (Proof Key for Code Exchange) Utilities
 * 
 * Implementation of RFC 7636 for OAuth 2.0 Authorization Code Flow
 * https://tools.ietf.org/html/rfc7636
 */

/**
 * Generate a cryptographically random code verifier
 * 
 * @param length - Length of the verifier (43-128 characters)
 * @returns Base64URL-encoded random string
 */
export function generateCodeVerifier(length: number = 128): string {
    const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let array = new Uint8Array(length);

    if (typeof window !== 'undefined' && window.crypto) {
        window.crypto.getRandomValues(array);
    } else {
        // Fallback for server-side rendering
        array = array.map(() => Math.floor(Math.random() * 256));
    }

    return Array.from(array, (byte) => validChars[byte % validChars.length]).join('');
}

/**
 * Generate code challenge from code verifier using SHA-256
 * 
 * @param codeVerifier - The code verifier string
 * @returns Base64URL-encoded SHA-256 hash of the verifier
 */
export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);

    // Hash with SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert to base64url
    return base64URLEncode(hashBuffer);
}

/**
 * Generate a random state parameter for CSRF protection
 * 
 * @param length - Length of the state string (default: 32)
 * @returns Random hex string
 */
export function generateState(length: number = 32): string {
    const array = new Uint8Array(length);

    if (typeof window !== 'undefined' && window.crypto) {
        window.crypto.getRandomValues(array);
    } else {
        // Fallback for server-side rendering
        array.forEach((_, i) => {
            array[i] = Math.floor(Math.random() * 256);
        });
    }

    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Base64URL encode a buffer
 * 
 * @param buffer - ArrayBuffer to encode
 * @returns Base64URL-encoded string
 */
function base64URLEncode(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';

    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * Store PKCE parameters in session storage
 * 
 * @param codeVerifier - The code verifier to store
 * @param state - The state parameter to store
 */
export function storePKCEParams(codeVerifier: string, state: string): void {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('oauth_code_verifier', codeVerifier);
        sessionStorage.setItem('oauth_state', state);
    }
}

/**
 * Retrieve and remove PKCE parameters from session storage
 * 
 * @returns Object containing codeVerifier and state
 */
export function retrievePKCEParams(): { codeVerifier: string | null; state: string | null } {
    if (typeof window === 'undefined') {
        return { codeVerifier: null, state: null };
    }

    const codeVerifier = sessionStorage.getItem('oauth_code_verifier');
    const state = sessionStorage.getItem('oauth_state');

    // Clean up after retrieval
    sessionStorage.removeItem('oauth_code_verifier');
    sessionStorage.removeItem('oauth_state');

    return { codeVerifier, state };
}

/**
 * Validate state parameter to prevent CSRF attacks
 * 
 * @param receivedState - State parameter from OAuth redirect
 * @param storedState - State parameter stored before redirect
 * @returns True if states match
 */
export function validateState(receivedState: string | null, storedState: string | null): boolean {
    if (!receivedState || !storedState) {
        return false;
    }

    return receivedState === storedState;
}

/**
 * Build Google OAuth authorization URL
 * 
 * @param clientId - Google OAuth client ID
 * @param redirectUri - Redirect URI after authorization
 * @param codeChallenge - PKCE code challenge
 * @param state - State parameter for CSRF protection
 * @returns Complete authorization URL
 */
export function buildGoogleAuthUrl(
    clientId: string,
    redirectUri: string,
    codeChallenge: string,
    state: string
): string {
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        state: state,
        access_type: 'offline', // Request refresh token
        prompt: 'consent', // Force consent screen to ensure refresh token
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Build Facebook OAuth authorization URL
 * 
 * @param appId - Facebook App ID
 * @param redirectUri - Redirect URI after authorization
 * @param state - State parameter for CSRF protection
 * @returns Complete authorization URL
 */
export function buildFacebookAuthUrl(
    appId: string,
    redirectUri: string,
    state: string
): string {
    const params = new URLSearchParams({
        client_id: appId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'email,public_profile',
        state: state,
    });

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
}

/**
 * Extract OAuth callback parameters from URL
 * 
 * @returns Object containing code, state, and error params
 */
export function extractCallbackParams(): {
    code: string | null;
    state: string | null;
    error: string | null;
    error_description: string | null;
} {
    if (typeof window === 'undefined') {
        return { code: null, state: null, error: null, error_description: null };
    }

    const params = new URLSearchParams(window.location.search);

    return {
        code: params.get('code'),
        state: params.get('state'),
        error: params.get('error'),
        error_description: params.get('error_description'),
    };
}
