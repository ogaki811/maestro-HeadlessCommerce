'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Dealer {
  id: string;
  name: string;
  postalCode: string;
  address: string;
  userCode?: string;         // ユーザーコード
  userName?: string;         // ユーザー名
  webId?: string;            // Web ID
  webUserName?: string;      // Web ID用氏名
}

interface DealerState {
  selectedDealer: Dealer | null;
  selectDealer: (dealer: Dealer) => void;
  clearDealer: () => void;
}

// サンプル販売店データ
export const sampleDealers: Dealer[] = [
  {
    id: 'dealer-a',
    name: 'プラス株式会社',
    postalCode: '100-0001',
    address: '東京都千代田区千代田1-1-1',
    userCode: '11100',
    userName: 'プラス市役所（Ａ事務機）',
    webId: '1588847004',
    webUserName: '本部共有デモ'
  },
  {
    id: 'dealer-b',
    name: '販売店B',
    postalCode: '150-0001',
    address: '東京都渋谷区神宮前1-2-3',
    userCode: '11101',
    userName: '渋谷支店',
    webId: '1588847005',
    webUserName: '山田太郎'
  },
  {
    id: 'dealer-c',
    name: '販売店C',
    postalCode: '530-0001',
    address: '大阪府大阪市北区梅田1-1-1',
    userCode: '11102',
    userName: '梅田営業所',
    webId: '1588847006',
    webUserName: '田中花子'
  },
  {
    id: 'dealer-d',
    name: '販売店D',
    postalCode: '220-0001',
    address: '神奈川県横浜市西区みなとみらい2-2-1',
    userCode: '11103',
    userName: '横浜支店',
    webId: '1588847007',
    webUserName: '佐藤次郎'
  },
  {
    id: 'dealer-e',
    name: '販売店E',
    postalCode: '450-0001',
    address: '愛知県名古屋市中村区名駅1-1-4',
    userCode: '11104',
    userName: '名古屋営業所',
    webId: '1588847008',
    webUserName: '鈴木一郎'
  },
  {
    id: 'dealer-f',
    name: '販売店F',
    postalCode: '810-0001',
    address: '福岡県福岡市中央区天神1-10-1',
    userCode: '11105',
    userName: '福岡支店',
    webId: '1588847009',
    webUserName: '高橋美咲'
  },
  {
    id: 'dealer-g',
    name: '販売店G',
    postalCode: '060-0001',
    address: '北海道札幌市中央区北一条西3-3',
    userCode: '11106',
    userName: '札幌営業所',
    webId: '1588847010',
    webUserName: '伊藤健太'
  }
];

const useDealerStore = create<DealerState>()(
  persist(
    (set) => ({
      // State
      selectedDealer: sampleDealers[0], // デフォルトで販売店Aを選択

      // Actions
      selectDealer: (dealer) => {
        set({ selectedDealer: dealer });
      },

      clearDealer: () => {
        set({ selectedDealer: null });
      },
    }),
    {
      name: 'dealer-storage',
      storage: createJSONStorage(() => {
        // SSR 対応
        if (typeof window !== 'undefined') {
          return window.localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);

export default useDealerStore;
