/**
 * Frontend Context Provider (Headless Commerce)
 * フロントエンドコンテキストプロバイダー（ヘッドレスコマース）
 */

import { getCurrentFrontendConfig, type FrontendConfig } from '@/constants/frontend-config';
import { type BusinessType } from '@/constants/business-types';

/**
 * Get frontend context
 * フロントエンドコンテキストを取得
 */
export function getFrontendContext(): FrontendConfig {
  return getCurrentFrontendConfig();
}

/**
 * Get business type from environment
 * 環境変数から商流タイプを取得
 */
export function getBusinessType(): BusinessType {
  const businessType = process.env.NEXT_PUBLIC_BUSINESS_TYPE as BusinessType;
  if (!businessType) {
    throw new Error('NEXT_PUBLIC_BUSINESS_TYPE is not defined');
  }
  return businessType;
}

/**
 * Get API endpoint from environment
 * 環境変数からAPIエンドポイントを取得
 */
export function getApiEndpoint(): string {
  return process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:4000';
}
