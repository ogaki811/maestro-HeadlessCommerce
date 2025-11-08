import type { NextConfig } from "next";

/**
 * S3静的ホスティング対応
 * NEXT_PUBLIC_STATIC_EXPORT=true の場合、静的エクスポートモード
 */
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  /**
   * 静的エクスポート設定
   * S3にデプロイする場合は output: 'export' が必要
   */
  output: isStaticExport ? 'export' : undefined,

  /**
   * トレイリングスラッシュ
   * S3静的ホスティングとの互換性向上
   */
  trailingSlash: isStaticExport,

  /**
   * 画像最適化設定
   * 静的エクスポートモードでは画像最適化APIが使用できないため無効化
   */
  images: {
    unoptimized: isStaticExport,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
