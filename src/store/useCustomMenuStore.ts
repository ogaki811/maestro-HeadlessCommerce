/**
 * useCustomMenuStore
 * カスタムメニュー状態管理Store
 *
 * ユーザーが選択したカスタムメニューIDを管理し、localStorageに永続化します。
 * ドロワーメニューで星アイコンをクリックすることで、
 * 選択したメニュー項目をヘッダー2段目に表示できます。
 */

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * カスタムメニューの状態インターフェース
 */
interface CustomMenuState {
  /**
   * 選択されたメニューID配列
   * デフォルト: ['quote-request', 'quick-order', 'my-catalog', 'order-history']
   */
  customMenuIds: string[];

  /**
   * カスタムメニューにIDを追加
   * すでに存在する場合は何もしない
   *
   * @param id - 追加するメニューID
   */
  addCustomMenu: (id: string) => void;

  /**
   * カスタムメニューからIDを削除
   * 存在しない場合は何もしない
   *
   * @param id - 削除するメニューID
   */
  removeCustomMenu: (id: string) => void;

  /**
   * カスタムメニューのIDをトグル（追加/削除の切り替え）
   * 選択済み → 削除
   * 未選択 → 追加
   *
   * @param id - トグルするメニューID
   */
  toggleCustomMenu: (id: string) => void;

  /**
   * 指定したIDがカスタムメニューに含まれているか確認
   *
   * @param id - 確認するメニューID
   * @returns 含まれている場合はtrue
   */
  isCustomMenu: (id: string) => boolean;
}

/**
 * カスタムメニューStoreのデフォルト値
 */
const DEFAULT_CUSTOM_MENU_IDS = [
  'quote-request',    // 見積り依頼
  'quick-order',      // クイックオーダー
  'my-catalog',       // マイカタログ
  'order-history',    // 注文履歴
];

/**
 * カスタムメニューStore
 *
 * - Zustandで状態管理
 * - persist middlewareでlocalStorageに自動保存
 * - SSR対応（window未定義時はダミーストレージ）
 */
const useCustomMenuStore = create<CustomMenuState>()(
  persist(
    (set, get) => ({
      // ==================
      // State（状態）
      // ==================

      /**
       * 選択されたメニューID配列
       * デフォルトで4つのメニューが選択済み
       */
      customMenuIds: DEFAULT_CUSTOM_MENU_IDS,

      // ==================
      // Actions（アクション）
      // ==================

      /**
       * カスタムメニューにIDを追加
       */
      addCustomMenu: (id: string) => {
        // 空文字・null・undefinedは無視
        if (!id) return;

        const { customMenuIds } = get();

        // すでに存在する場合は何もしない
        if (customMenuIds.includes(id)) return;

        // 配列の最後に追加
        set({
          customMenuIds: [...customMenuIds, id],
        });
      },

      /**
       * カスタムメニューからIDを削除
       */
      removeCustomMenu: (id: string) => {
        // 空文字・null・undefinedは無視
        if (!id) return;

        const { customMenuIds } = get();

        // フィルタリングして削除
        set({
          customMenuIds: customMenuIds.filter((menuId) => menuId !== id),
        });
      },

      /**
       * カスタムメニューのIDをトグル
       */
      toggleCustomMenu: (id: string) => {
        const { customMenuIds, addCustomMenu, removeCustomMenu } = get();

        if (customMenuIds.includes(id)) {
          // すでに選択済み → 削除
          removeCustomMenu(id);
        } else {
          // 未選択 → 追加
          addCustomMenu(id);
        }
      },

      /**
       * 指定したIDがカスタムメニューに含まれているか確認
       */
      isCustomMenu: (id: string) => {
        const { customMenuIds } = get();
        return customMenuIds.includes(id);
      },
    }),
    {
      name: 'custom-menu-storage', // localStorageのキー名
      storage: createJSONStorage(() => {
        // SSR対応: window未定義時はダミーストレージ
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
    }
  )
);

export default useCustomMenuStore;
