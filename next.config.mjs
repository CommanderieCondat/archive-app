/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Disable ESLint during build validation
        ignoreDuringBuilds: true,
      },
      headers() {
        return [
        //   {
        //     source: '/(.*)',
        //     headers: securityHeaders,
        //   },
          {
            source: '/',
            headers: [
              { key: 'Access-Control-Allow-Origin', value: '*' },
              { key: 'Access-Control-Allow-Methods', value: 'GET,HEAD,PUT,PATCH,POST,DELETE' },
              { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
            ],
          },
        ];
      },

};

export default nextConfig;
