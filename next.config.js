/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const target = process.env.API_INTERNAL_URL || 'http://127.0.0.1:3001';
    const url = new URL(target);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error('API_INTERNAL_URL must be a server origin without credentials or paths.');
    return [
      { source: '/api/worker/:path*', destination: `${url.origin}/api/worker/:path*` },
      { source: '/api/account/:path*', destination: `${url.origin}/api/account/:path*` },
    ];
  },
  async headers() {
    return [{ source: '/:path*', headers: [
      {key:'X-Content-Type-Options',value:'nosniff'},
      {key:'Referrer-Policy',value:'no-referrer'},
      {key:'X-Frame-Options',value:'DENY'},
      {key:'Permissions-Policy',value:'geolocation=(self), camera=(), microphone=()'},
      {key:'Cache-Control',value:'no-store'},
      {key:'Content-Security-Policy',value:"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'"},
    ] }];
  },
};
module.exports = nextConfig;
