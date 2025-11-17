import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * ContactCard Props
 */
export interface ContactCardProps {
  /**
   * 営業担当者名
   */
  name: string;

  /**
   * 所属会社・部署
   */
  company: string;

  /**
   * 電話番号
   */
  tel: string;

  /**
   * FAX番号（任意）
   */
  fax?: string;

  /**
   * 携帯電話番号
   */
  mobile: string;

  /**
   * メールアドレス
   */
  email: string;

  /**
   * アバター画像URL（任意）
   */
  avatarUrl?: string;

  /**
   * 注意書きテキスト（任意）
   */
  note?: string;

  /**
   * 追加のCSSクラス
   */
  className?: string;
}

/**
 * ContactCard - 連絡先情報カードコンポーネント（Molecule）
 *
 * 販売店担当営業情報を表示するカードコンポーネント。
 * 営業担当者の連絡先情報とアバター画像を表示。
 *
 * @example
 * ```tsx
 * <ContactCard
 *   name="長谷べすず"
 *   company="スマートオフィス販売店SOⅡ企画"
 *   tel="042-329-3103"
 *   mobile="070-8695-6076"
 *   email="ahasebe@jointex.jp"
 *   avatarUrl="/img/avatars/sales-rep.svg"
 * />
 * ```
 */
export default function ContactCard({
  name,
  company,
  tel,
  fax,
  mobile,
  email,
  avatarUrl,
  note,
  className = '',
}: ContactCardProps) {
  return (
    <div className={className}>
      {/* 担当者情報とアバター */}
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-1">
          <p className="text-sm text-gray-900 leading-relaxed">
            御社を担当いたします
            <br />
            {company}
            <br />
            {name}
          </p>
        </div>
        {avatarUrl && (
          <div className="flex-shrink-0">
            <Image
              src={avatarUrl}
              alt="営業担当者"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
        )}
      </div>

      {/* 注意書き */}
      {note && (
        <div className="mb-4 text-xs text-gray-600">
          <p className="leading-relaxed">
            {note}
            <br />
            お届け、キャンセル、返品等については
            <Link href="/help/contact" className="text-blue-600 underline hover:no-underline">
              こちら
            </Link>
          </p>
        </div>
      )}

      {/* 連絡先情報 */}
      <div className="space-y-1 text-sm">
        <div className="flex">
          <span className="w-16 text-gray-700">TEL</span>
          <span className="text-gray-600">:</span>
          <span className="ml-2 text-gray-900">{tel}</span>
        </div>
        <div className="flex">
          <span className="w-16 text-gray-700">FAX</span>
          <span className="text-gray-600">:</span>
          {fax && <span className="ml-2 text-gray-900">{fax}</span>}
        </div>
        <div className="flex">
          <span className="w-16 text-gray-700">Mobile</span>
          <span className="text-gray-600">:</span>
          <span className="ml-2 text-gray-900">{mobile}</span>
        </div>
        <div className="flex">
          <span className="w-16 text-gray-700">E-mail</span>
          <span className="text-gray-600">:</span>
          <span className="ml-2 text-gray-900">{email}</span>
        </div>
      </div>
    </div>
  );
}
