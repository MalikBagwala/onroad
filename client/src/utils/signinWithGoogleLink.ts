function signinWithGoogleLink(email?: string) {
  const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    response_type: 'code',
    scope: 'openid profile email',
    redirect_uri: `https://${import.meta.env.VITE_API_DOMAIN}/api/oauth`,
  });
  if (email) params.append('login_hint', email);

  return `${baseUrl}?${params.toString()}`;
}

export default signinWithGoogleLink;
