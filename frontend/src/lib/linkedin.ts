// const authBase = 'https://www.linkedin.com/oauth/v2/authorization'
// const tokenBase = 'https://www.linkedin.com/oauth/v2/accessToken'

// export function getLinkedInAuthUrl() {
//   const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID || 'demo'
//   const redirectUri = encodeURIComponent(import.meta.env.VITE_LINKEDIN_REDIRECT_URI || 'http://localhost:5173/linkedin/callback')
//   const scope = encodeURIComponent('r_liteprofile r_emailaddress')
//   const state = 'demo_state'
//   const url = ${authBase}?response_type=code&client_id=&redirect_uri=&scope=&state=
//   return url
// }

// export async function exchangeLinkedInCodeForToken(_code: string) {
//   // Placeholder: In production, exchange on backend to protect client secret
//   return { access_token: 'demo', expires_in: 3600 }
// }

// export async function fetchLinkedInProfile(_accessToken: string) {
//   // Placeholder: Would call LinkedIn APIs on the backend due to CORS and secrets
//   return { firstName: 'Demo', lastName: 'User', headline: 'Student' }
// }
