/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: { fs: false },
      extensionAlias: {
        '.js': ['.js', '.ts', '.tsx']
      }
    };
    return config;
  },
  // アップロードされたファイルを public ディレクトリで提供
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
