/**
 * Table Components - 汎用テーブルコンポーネント群（Atomic Design: Atoms）
 *
 * BtoB見積依頼テーブル等で使用する汎用的なテーブルコンポーネント。
 * Tailwind CSSでスタイリング。
 */

export { default as Table } from './Table';
export { default as TableHeader } from './TableHeader';
export { default as TableBody } from './TableBody';
export { default as TableRow } from './TableRow';
export { default as TableHeaderCell } from './TableHeaderCell';
export { default as TableCell } from './TableCell';

export type { TableProps } from './Table';
export type { TableHeaderProps } from './TableHeader';
export type { TableBodyProps } from './TableBody';
export type { TableRowProps } from './TableRow';
export type { TableHeaderCellProps } from './TableHeaderCell';
export type { TableCellProps } from './TableCell';
