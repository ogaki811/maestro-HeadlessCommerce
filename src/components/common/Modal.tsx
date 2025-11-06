'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'secondary' | 'outline' | 'danger';
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '確認',
  cancelText = 'キャンセル',
  confirmVariant = 'primary',
}: ModalProps) {
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

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="ec-modal fixed inset-0 z-50 flex items-center justify-center">
      {/* オーバーレイ */}
      <div
        className="ec-modal__overlay absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* モーダルコンテンツ */}
      <div className="ec-modal__content relative bg-white rounded shadow-xl max-w-md w-full mx-4 transform transition-all">
        {/* ヘッダー */}
        <div className="ec-modal__header flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="ec-modal__title text-xl font-semibold text-gray-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="ec-modal__close text-gray-400 hover:text-gray-600 transition-colors"
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

        {/* ボディ */}
        <div className="ec-modal__body p-6">
          <p className="ec-modal__message text-gray-700 leading-relaxed">
            {message}
          </p>
        </div>

        {/* フッター */}
        <div className="ec-modal__footer flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b">
          <Button
            variant="outline"
            onClick={onClose}
            className="ec-modal__cancel-btn"
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            className="ec-modal__confirm-btn"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
