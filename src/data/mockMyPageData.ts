/**
 * Mock Data for MyPage Dashboard
 * マイページダッシュボード用のモックデータ
 */

import type { InfoRow } from '@/components/mypage/InfoTable';
import type { QuickLink } from '@/components/mypage/QuickLinksCard';

/**
 * ご登録情報
 */
export const mockUserProfile: InfoRow[] = [
  {
    label: 'ご担当者名',
    value: '小川祐樹 様',
  },
  {
    label: 'メールアドレス',
    value: 'ogawa@example.com',
  },
  {
    label: 'Web ID',
    value: '1313111006',
  },
];

/**
 * 管理者権限情報（2列レイアウト）
 */
export const mockUserPermissions: InfoRow[] = [
  {
    label: '管理者権限',
    value: '一般',
  },
  {
    label: '承認者設定',
    value: 'なし',
  },
];

/**
 * 会社情報
 */
export const mockCompanyInfo: InfoRow[] = [
  {
    label: '会社名',
    value: '松村商事株式会社',
  },
  {
    label: '部署名',
    value: 'システム企画部',
  },
];

/**
 * ユーザー・販売店コード情報（2列レイアウト）
 */
export const mockCompanyCodes: InfoRow[] = [
  {
    label: 'ユーザーコード',
    value: '0001',
  },
  {
    label: '販売店コード',
    value: '999997-00',
  },
  {
    label: '法人設定',
    value: 'なし',
  },
  {
    label: '代表法人コード',
    value: '0001',
  },
];

/**
 * ポイント情報
 */
export const mockPointInfo = {
  currentPoints: 0,
  expiringThisMonth: 0,
  expiringNextMonth: 0,
};

/**
 * 販売店担当営業情報
 */
export const mockSalesRepInfo = {
  name: '長谷べすず',
  company: 'スマートオフィス販売店SOⅡ企画',
  tel: '042-329-3103',
  fax: '',
  mobile: '070-8695-6076',
  email: 'ahasebe@jointex.jp',
  avatarUrl: '/img/avatars/sales-rep-default.svg',
  note: '※ご請求に関しては、販売店までご連絡下さい。',
};

/**
 * お問い合わせ・ご利用ガイドリンク
 */
export const mockHelpLinks: QuickLink[] = [
  {
    label: 'ご利用ガイド',
    href: '/help/guide',
  },
  {
    label: 'よくあるご質問',
    href: '/help/faq',
  },
  {
    label: 'お問い合わせ',
    href: '/contact',
  },
];
