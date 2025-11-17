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
  // ヘッダーカラーのスタイル
  const headerColorStyles = {
    orange: 'bg-orange-500',
    teal: 'bg-teal-600',
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      {/* ヘッダー */}
      <div
        className={`${headerColorStyles[headerColor]} px-4 py-3 flex items-center justify-between`}
      >
        <h2 className="text-base font-bold text-white m-0 flex items-center">
          <span className="inline-block w-1 h-5 bg-white mr-2"></span>
          {title}
        </h2>
        {actionLink && (
          <Link
            href={actionLink.href}
            className="text-white text-sm underline hover:no-underline transition-all"
          >
            {actionLink.text}
          </Link>
        )}
      </div>

      {/* コンテンツ */}
      <div className="p-6">{children}</div>
    </div>
  );
}
