'use client';

import { Icon } from '@/components/ui/Icon';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = '商品を検索',
  className = '',
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(value);
  };

  const handleClear = () => {
    onChange('');
    onSearch?.('');
  };

  return (
    <form onSubmit={handleSubmit} className={`ec-search-bar ${className}`}>
      <div className="ec-search-bar__container relative">
        <div className="ec-search-bar__input-wrapper relative flex items-center">
          <Icon
            name="search"
            size="md"
            className="ec-search-bar__icon absolute left-3 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="ec-search-bar__input w-full pl-10 pr-20 py-3 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 bg-white focus:outline-none focus:border-black focus:shadow-lg focus:shadow-blue-100"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="ec-search-bar__clear absolute right-12 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="検索をクリア"
            >
              <Icon name="close" size="sm" />
            </button>
          )}
          <button
            type="submit"
            className="ec-search-bar__submit absolute right-2 px-3 py-1.5 bg-black text-white rounded-md hover:bg-gray-900 transition-colors"
          >
            検索
          </button>
        </div>
      </div>
    </form>
  );
}
