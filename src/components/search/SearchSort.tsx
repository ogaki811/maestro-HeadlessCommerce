import type { ProductSortOption } from '@/types';

interface SearchSortProps {
  sortBy: ProductSortOption;
  onSortChange: (value: ProductSortOption) => void;
  resultCount: number;
  currentPage?: number;
  itemsPerPage?: number;
}

export default function SearchSort({
  sortBy,
  onSortChange,
  resultCount,
  currentPage = 1,
  itemsPerPage = 12,
}: SearchSortProps) {
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, resultCount);

  return (
    <div className="ec-search-sort flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-white rounded-lg border border-gray-200">
      <div className="ec-search-sort__count text-sm text-gray-600">
        {resultCount > 0 ? (
          <>
            <span className="ec-search-sort__range font-medium text-gray-900">
              {startIndex}〜{endIndex}件
            </span>
            を表示（全
            <span className="ec-search-sort__total font-medium text-gray-900">
              {resultCount}件
            </span>
            中）
          </>
        ) : (
          '該当する商品はありません'
        )}
      </div>

      <div className="ec-search-sort__selector flex items-center gap-2">
        <label htmlFor="sort-select" className="ec-search-sort__label text-sm text-gray-700">
          並び替え:
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as ProductSortOption)}
          className="ec-search-sort__select"
        >
          <option value="name-asc">商品名（昇順）</option>
          <option value="name-desc">商品名（降順）</option>
          <option value="price-asc">価格が安い順</option>
          <option value="price-desc">価格が高い順</option>
          <option value="rating-desc">評価が高い順</option>
          <option value="newest">新着順</option>
        </select>
      </div>
    </div>
  );
}
