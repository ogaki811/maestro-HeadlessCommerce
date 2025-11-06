'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import DealerSwitchModal from './DealerSwitchModal';
import useDealerStore, { sampleDealers, type Dealer } from '@/store/useDealerStore';

export default function DealerSelectorButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingDealer, setPendingDealer] = useState<Dealer | null>(null);
  const { selectedDealer, selectDealer } = useDealerStore();

  const MAX_DISPLAY_DEALERS = 5;
  const displayDealers = sampleDealers.slice(0, MAX_DISPLAY_DEALERS);
  const hasMoreDealers = sampleDealers.length > MAX_DISPLAY_DEALERS;

  const handleDealerSelect = (dealer: Dealer) => {
    // 同じ販売店を選択した場合は何もしない
    if (selectedDealer?.id === dealer.id) {
      setIsOpen(false);
      return;
    }

    // 確認モーダルを表示
    setPendingDealer(dealer);
    setIsModalOpen(true);
    setIsOpen(false);
  };

  const handleConfirmSwitch = () => {
    if (pendingDealer) {
      // TODO: カートクリア機能実装時
      // clearCart();

      selectDealer(pendingDealer);
      toast.success(`${pendingDealer.name}に切り替えました`);
    }
    setIsModalOpen(false);
    setPendingDealer(null);
  };

  const handleCancelSwitch = () => {
    setIsModalOpen(false);
    setPendingDealer(null);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2
          text-sm
          text-[#2d2626]
          border-l border-gray-300
          pl-4
          hover:text-gray-900
          transition-colors
          font-medium
        "
      >
        <svg
          className="w-4 h-4 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-label="販売店選択"
          role="img"
        >
          <title>販売店</title>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span className="truncate max-w-[150px]">
          {selectedDealer?.name || sampleDealers[0].name}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <>
          {/* オーバーレイ */}
          <div
            className="fixed inset-0 z-[110]"
            onClick={() => setIsOpen(false)}
          />

          {/* ドロップダウンメニュー */}
          <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-[111]">
            <div className="p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">販売店を選択</h3>
              <ul className="space-y-2">
                {displayDealers.map((dealer) => (
                  <li key={dealer.id}>
                    <button
                      onClick={() => handleDealerSelect(dealer)}
                      className={`
                        w-full text-left px-3 py-2 text-sm rounded-md transition-colors
                        ${selectedDealer?.id === dealer.id
                          ? 'bg-[#2d2626] text-white'
                          : 'hover:bg-gray-100'
                        }
                      `}
                    >
                      <div className="font-medium">{dealer.name}</div>
                      <div className={`text-xs ${selectedDealer?.id === dealer.id ? 'text-gray-200' : 'text-gray-500'}`}>
                        〒{dealer.postalCode} {dealer.address}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>

              {hasMoreDealers && (
                <div className="mt-3 px-3 py-2 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-600 text-center">
                    他 {sampleDealers.length - MAX_DISPLAY_DEALERS} 件の販売店があります
                  </p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  href="/dealers"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-3 py-2 text-sm text-[#2d2626] font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  {hasMoreDealers ? '全ての販売店を見る' : '販売店一覧を見る'}
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 確認モーダル */}
      <DealerSwitchModal
        isOpen={isModalOpen}
        onClose={handleCancelSwitch}
        onConfirm={handleConfirmSwitch}
        dealer={pendingDealer}
      />
    </div>
  );
}
