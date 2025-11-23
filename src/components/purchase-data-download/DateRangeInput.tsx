'use client';

import React, { useRef } from 'react';

interface DateRangeInputProps {
  label: string;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  error?: string;
  minDate?: string;
  maxDate?: string;
}

/**
 * カレンダーアイコンコンポーネント
 */
const CalendarIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

/**
 * 日付範囲入力コンポーネント
 * 年・月・日を個別入力 + カレンダーピッカー
 */
export const DateRangeInput: React.FC<DateRangeInputProps> = ({
  label,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  error,
  minDate,
  maxDate,
}) => {
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  // 日付文字列を年・月・日に分解
  const parseDate = (dateStr: string) => {
    if (!dateStr) return { year: '', month: '', day: '' };
    const [year, month, day] = dateStr.split('-');
    return { year: year || '', month: month || '', day: day || '' };
  };

  // 年・月・日を日付文字列に結合
  const formatDate = (year: string, month: string, day: string) => {
    if (!year || !month || !day) return '';
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const startParts = parseDate(startDate);
  const endParts = parseDate(endDate);

  const handleStartPartChange = (part: 'year' | 'month' | 'day', value: string) => {
    const newParts = { ...startParts, [part]: value };
    const newDate = formatDate(newParts.year, newParts.month, newParts.day);
    if (newDate || (!newParts.year && !newParts.month && !newParts.day)) {
      onStartDateChange(newDate);
    }
  };

  const handleEndPartChange = (part: 'year' | 'month' | 'day', value: string) => {
    const newParts = { ...endParts, [part]: value };
    const newDate = formatDate(newParts.year, newParts.month, newParts.day);
    if (newDate || (!newParts.year && !newParts.month && !newParts.day)) {
      onEndDateChange(newDate);
    }
  };

  const openStartCalendar = () => {
    startDateRef.current?.showPicker();
  };

  const openEndCalendar = () => {
    endDateRef.current?.showPicker();
  };

  const inputBaseClass = 'w-16 px-2 py-2 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-[#2d2626] focus:border-transparent';
  const yearInputClass = 'w-20 px-2 py-2 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-[#2d2626] focus:border-transparent';

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="flex flex-wrap items-center gap-2">
        {/* 開始日 */}
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={startParts.year}
            onChange={(e) => handleStartPartChange('year', e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="2021"
            className={yearInputClass}
            maxLength={4}
            aria-label="開始年"
          />
          <span className="text-gray-600">年</span>
          <input
            type="text"
            value={startParts.month}
            onChange={(e) => handleStartPartChange('month', e.target.value.replace(/\D/g, '').slice(0, 2))}
            placeholder="01"
            className={inputBaseClass}
            maxLength={2}
            aria-label="開始月"
          />
          <span className="text-gray-600">月</span>
          <input
            type="text"
            value={startParts.day}
            onChange={(e) => handleStartPartChange('day', e.target.value.replace(/\D/g, '').slice(0, 2))}
            placeholder="01"
            className={inputBaseClass}
            maxLength={2}
            aria-label="開始日"
          />
          <span className="text-gray-600">日</span>

          {/* カレンダーボタン */}
          <div className="relative">
            <button
              type="button"
              onClick={openStartCalendar}
              className="w-10 h-10 flex items-center justify-center border border-[#d4a017] bg-[#d4a017] rounded cursor-pointer hover:bg-[#c49515] transition-colors"
              aria-label="開始日カレンダーを開く"
            >
              <CalendarIcon className="w-5 h-5 text-white" />
            </button>
            <input
              ref={startDateRef}
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              min={minDate}
              max={maxDate}
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label="開始日カレンダー"
              tabIndex={-1}
            />
          </div>
        </div>

        <span className="text-gray-600 px-2">〜</span>

        {/* 終了日 */}
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={endParts.year}
            onChange={(e) => handleEndPartChange('year', e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="2025"
            className={yearInputClass}
            maxLength={4}
            aria-label="終了年"
          />
          <span className="text-gray-600">年</span>
          <input
            type="text"
            value={endParts.month}
            onChange={(e) => handleEndPartChange('month', e.target.value.replace(/\D/g, '').slice(0, 2))}
            placeholder="11"
            className={inputBaseClass}
            maxLength={2}
            aria-label="終了月"
          />
          <span className="text-gray-600">月</span>
          <input
            type="text"
            value={endParts.day}
            onChange={(e) => handleEndPartChange('day', e.target.value.replace(/\D/g, '').slice(0, 2))}
            placeholder="23"
            className={inputBaseClass}
            maxLength={2}
            aria-label="終了日"
          />
          <span className="text-gray-600">日</span>

          {/* カレンダーボタン */}
          <div className="relative">
            <button
              type="button"
              onClick={openEndCalendar}
              className="w-10 h-10 flex items-center justify-center border border-[#d4a017] bg-[#d4a017] rounded cursor-pointer hover:bg-[#c49515] transition-colors"
              aria-label="終了日カレンダーを開く"
            >
              <CalendarIcon className="w-5 h-5 text-white" />
            </button>
            <input
              ref={endDateRef}
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              min={minDate}
              max={maxDate}
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label="終了日カレンダー"
              tabIndex={-1}
            />
          </div>
        </div>

        <span className="text-gray-500 text-sm">(半角)</span>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default DateRangeInput;
