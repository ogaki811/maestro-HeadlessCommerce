'use client';

import { Select } from '@/components/ui/Select';
import type { ProductSortOption } from '@/types';

interface SortDropdownProps {
  value: ProductSortOption;
  onChange: (value: ProductSortOption) => void;
  className?: string;
}

const sortOptions = [
  { value: 'name-asc', label: '名前（A-Z）' },
  { value: 'name-desc', label: '名前（Z-A）' },
  { value: 'price-asc', label: '価格が安い順' },
  { value: 'price-desc', label: '価格が高い順' },
  { value: 'rating-desc', label: '評価が高い順' },
  { value: 'newest', label: '新着順' },
];

export default function SortDropdown({
  value,
  onChange,
  className = '',
}: SortDropdownProps) {
  return (
    <div className={`ec-sort-dropdown ${className}`}>
      <Select
        name="sort"
        value={value}
        onChange={(e) => onChange(e.target.value as ProductSortOption)}
        options={sortOptions}
        label="並び替え"
        className="ec-sort-dropdown__select"
      />
    </div>
  );
}
