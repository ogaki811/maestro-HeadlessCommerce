/**
 * Frontend Configuration (Headless Commerce)
 * フロントエンド設定（ヘッドレスコマース）
 */

import { BUSINESS_TYPES, type BusinessType } from './business-types';

/**
 * Frontend Configuration
 * フロントエンド設定（各Maestroインスタンスごと）
 */
export interface FrontendConfig {
  name: string;
  businessType: BusinessType;
  apiEndpoint: string;
  features: {
    enablePoints?: boolean;
    enableDealerCode?: boolean;
    enableBackorder?: boolean;
    enableQuoteSystem?: boolean;
    enableBulkOrder?: boolean;
    enableVolumeDiscount?: boolean;
    enableGuestCheckout?: boolean;
    enableWishlist?: boolean;
    enableProductReviews?: boolean;
  };
  branding: {
    primaryColor: string;
    logoUrl: string;
    faviconUrl: string;
  };
}

/**
 * Get current frontend configuration from environment
 * 環境変数から現在のフロントエンド設定を取得
 */
export function getCurrentFrontendConfig(): FrontendConfig {
  const businessType = process.env.NEXT_PUBLIC_BUSINESS_TYPE as BusinessType;
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:4000';

  if (!businessType || !BUSINESS_TYPES[businessType.toUpperCase() as keyof typeof BUSINESS_TYPES]) {
    throw new Error(
      `Invalid or missing NEXT_PUBLIC_BUSINESS_TYPE: ${businessType}. Must be one of: toc, wholesale, retail`
    );
  }

  // Business type specific configuration
  const configs: Record<BusinessType, FrontendConfig> = {
    [BUSINESS_TYPES.TOC]: {
      name: 'Maestro TOC',
      businessType: BUSINESS_TYPES.TOC,
      apiEndpoint,
      features: {
        enablePoints: true,
        enableDealerCode: true,
        enableBackorder: true,
      },
      branding: {
        primaryColor: '#1a56db',
        logoUrl: '/images/logo-toc.svg',
        faviconUrl: '/favicon-toc.ico',
      },
    },
    [BUSINESS_TYPES.WHOLESALE]: {
      name: 'Maestro Wholesale',
      businessType: BUSINESS_TYPES.WHOLESALE,
      apiEndpoint,
      features: {
        enableQuoteSystem: true,
        enableBulkOrder: true,
        enableVolumeDiscount: true,
      },
      branding: {
        primaryColor: '#047857',
        logoUrl: '/images/logo-wholesale.svg',
        faviconUrl: '/favicon-wholesale.ico',
      },
    },
    [BUSINESS_TYPES.RETAIL]: {
      name: 'Maestro Retail',
      businessType: BUSINESS_TYPES.RETAIL,
      apiEndpoint,
      features: {
        enableGuestCheckout: true,
        enableWishlist: true,
        enableProductReviews: true,
        enablePoints: true,
      },
      branding: {
        primaryColor: '#dc2626',
        logoUrl: '/images/logo-retail.svg',
        faviconUrl: '/favicon-retail.ico',
      },
    },
  };

  return configs[businessType];
}
