/**
 * QuickOrderHelpSection Component (Organism)
 * クイックオーダーヘルプセクション
 *
 * クイックオーダーページの使い方ガイドを表示する
 */

import React from 'react';

/**
 * QuickOrderHelpSection
 *
 * クイックオーダーの使い方を表示するヘルプセクション
 *
 * @example
 * <QuickOrderHelpSection />
 */
export default function QuickOrderHelpSection() {
  return (
    <aside
      className="p-6 bg-blue-50 border border-blue-200 rounded-xl"
      aria-label="クイックオーダーの使い方"
    >
      <h3 className="mb-4 text-lg font-semibold text-blue-900">💡 使い方</h3>

      <ol className="mb-4 pl-6 list-decimal text-gray-700 space-y-2">
        <li>商品コードまたはJANコードを入力してください</li>
        <li>自動的に商品情報が表示されます</li>
        <li>数量を調整して「追加」ボタンをクリック</li>
        <li>必要な商品を全て追加したら「カートに追加」をクリック</li>
      </ol>

      <p className="m-0 p-3 bg-white border-l-4 border-blue-500 rounded text-sm text-gray-700">
        <strong className="text-blue-900">ヒント:</strong> Enterキーを押すと素早く商品を追加できます
      </p>
    </aside>
  );
}
