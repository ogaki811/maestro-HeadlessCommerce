'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button';
import type { Dealer } from '@/store/useDealerStore';

interface DealerSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  dealer: Dealer | null;
}

export default function DealerSwitchModal({
  isOpen,
  onClose,
  onConfirm,
  dealer
}: DealerSwitchModalProps) {
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

  // bodyスクロール無効化
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

  if (!isOpen || !dealer) return null;

  return createPortal(
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* モーダルコンテンツ */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            販売店切り替え確認
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="閉じる"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ボディ */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            下記ユーザーのアカウントに切り替えます。<br />
            お間違いないかご確認ください。
          </p>

          {/* 販売店情報カード */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
            {/* 販売店名 */}
            <div>
              <div className="text-xs text-gray-500 mb-1">販売店名</div>
              <div className="text-base font-semibold text-gray-900">
                {dealer.name}
              </div>
            </div>

            {/* ユーザーコード / ユーザー名 */}
            {(dealer.userCode || dealer.userName) && (
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  ユーザーコード / ユーザー名
                </div>
                <div className="text-sm text-gray-900">
                  {dealer.userCode && <div>{dealer.userCode}</div>}
                  {dealer.userName && <div>{dealer.userName}</div>}
                </div>
              </div>
            )}

            {/* Web ID / 氏名 */}
            {(dealer.webId || dealer.webUserName) && (
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  Web ID / 氏名
                </div>
                <div className="text-sm text-gray-900">
                  {dealer.webId && <div>{dealer.webId}</div>}
                  {dealer.webUserName && <div>{dealer.webUserName}</div>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* フッター */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <Button variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            切り替える
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
