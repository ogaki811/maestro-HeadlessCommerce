import React from 'react';
import Link from 'next/link';

/**
 * SectionCard Props
 */
export interface SectionCardProps {
  /**
   * セクションタイトル
   */
  title: string;

  /**
   * ヘッダーの色
   * - orange: オレンジ色（ご登録情報、会社情報、ポイント情報用）
   * - teal: 青緑色（販売店担当営業情報、お問い合わせ用）
   */
  headerColor: 'orange' | 'teal';

  /**
   * 右上のアクションリンク（任意）
   */
  actionLink?: {
    text: string;
    href: string;
  };

  /**
   * カード内のコンテンツ
   */
  children: React.ReactNode;

  /**
   * 追加のCSSクラス
   */
  className?: string;
}

/**
 * SectionCard - セクションカードコンポーネント（Molecule）
 *
 * マイページダッシュボード用のセクションカード。
 * オレンジまたは青緑のヘッダーを持つカードコンポーネント。
 *
 * @example
 * ```tsx
 * <SectionCard
 *   title="ご登録情報"
 *   headerColor="orange"
 *   actionLink={{ text: 'ご登録情報の修正', href: '/mypage/settings' }}
 * >
 *   <InfoTable data={userInfo} />
 * </SectionCard>
 * ```
 */
export default function SectionCard({
  title,
  headerColor,
  actionLink,
  children,
  className = '',
}: SectionCardProps) {
  return (
    <section className={`mb-12 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          {title}
        </h3>
        {actionLink && (
          <Link
            href={actionLink.href}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md transition-colors"
          >
            {actionLink.text}
          </Link>
        )}
      </div>
      <div className="bg-gray-50 rounded-lg p-6">
        {children}
      </div>
    </section>
  );
}
