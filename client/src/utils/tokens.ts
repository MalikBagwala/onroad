export const ACCESS_TOKEN_KEY = 'token';
export const REFRESH_TOKEN_KEY = 'refreshToken';

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setAccessToken = (token: string) => localStorage.setItem(ACCESS_TOKEN_KEY, token);
export const setRefreshToken = (token: string) => localStorage.setItem(REFRESH_TOKEN_KEY, token);

export const removeAccessToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY);
export const removeRefreshToken = () => localStorage.removeItem(REFRESH_TOKEN_KEY);

function decodeJWT(token: string) {
  // Split the token into header, payload, and signature
  const [header, payload, signature] = token.split('.');

  // Decode the base64-encoded header and payload
  const decodedHeader = JSON.parse(atob(header));
  const decodedPayload = JSON.parse(atob(payload));

  // Return an object with decoded header and payload
  return {
    header: decodedHeader,
    payload: decodedPayload,
    signature: signature, // Note: The signature is not decoded
  };
}

export const hasTokenExpired = (token: string | null) => {
  if (!token) return true;
  try {
    const decoded = decodeJWT(token);
    const now = Date.now() / 1000;
    return decoded.payload.exp < now;
  } catch (e) {
    return true;
  }
};
