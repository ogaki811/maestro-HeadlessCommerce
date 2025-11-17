import React from 'react';
import Link from 'next/link';

/**
 * QuickLink - クイックリンクの型
 */
export interface QuickLink {
  /**
   * リンクラベル
   */
  label: string;

  /**
   * リンク先URL
   */
  href: string;
}

/**
 * QuickLinksCard Props
 */
export interface QuickLinksCardProps {
  /**
   * リンク一覧
   */
  links: QuickLink[];

  /**
   * 追加のCSSクラス
   */
  className?: string;
}

/**
 * QuickLinksCard - クイックリンクカードコンポーネント（Molecule）
 *
 * 複数のリンクをカード形式で表示するコンポーネント。
 * お問い合わせ・ご利用ガイドセクションなどで使用。
 *
 * @example
 * ```tsx
 * <QuickLinksCard
 *   links={[
 *     { label: 'ご利用ガイド', href: '/help/guide' },
 *     { label: 'よくあるご質問', href: '/help/faq' },
 *     { label: 'お問い合わせ', href: '/contact' },
 *   ]}
 * />
 * ```
 */
export default function QuickLinksCard({ links, className = '' }: QuickLinksCardProps) {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.href}
          className="text-sm text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
