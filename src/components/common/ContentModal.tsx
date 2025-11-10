'use client';

import { useEffect, ReactNode } from 'react';

export interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

/**
 * ContentModal - コンテンツ表示用モーダルコンポーネント（Molecule）
 *
 * 複雑なコンテンツ（テーブル、フォームなど）を表示できる汎用モーダル。
 * 確認ダイアログには Modal.tsx を使用してください。
 */
export default function ContentModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'lg',
}: ContentModalProps) {
  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // モーダルが開いているときはbodyのスクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  return (
    <div className="ec-content-modal fixed inset-0 z-50 flex items-center justify-center">
      {/* オーバーレイ */}
      <div
        className="ec-content-modal__overlay absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* モーダルコンテンツ */}
      <div
        className={`ec-content-modal__content relative bg-white rounded shadow-xl ${maxWidthClass} w-full mx-4 transform transition-all max-h-[90vh] flex flex-col`}
      >
        {/* ヘッダー */}
        <div className="ec-content-modal__header flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="ec-content-modal__title text-xl font-semibold text-gray-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="ec-content-modal__close text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="閉じる"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* ボディ（スクロール可能） */}
        <div className="ec-content-modal__body p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
