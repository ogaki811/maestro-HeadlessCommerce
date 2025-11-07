/**
 * QuickOrderRow Component (Molecule)
 * クイックオーダー1行入力
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCodeInput from '@/components/common/ProductCodeInput';
import NumberInput from '@/components/ui/NumberInput';
import type { ProductSearchResult, ProductSearchError } from '@/hooks/useProductSearch';

export interface QuickOrderRowProps {
  rowIndex: number;
  productCode: string;
  quantity: number;
  onProductCodeChange: (value: string) => void;
  onQuantityChange: (value: number) => void;
  onReset: () => void;
  onSwitchToAlternative?: (alternativeCode: string) => void;
  product: ProductSearchResult | null;
  error: ProductSearchError | null;
  isSearching: boolean;
}

// スタイル定数
const STYLES = {
  container: 'grid grid-cols-[auto_1fr_auto_2fr_auto] gap-4 items-center p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors',
  rowNumber: 'flex items-center justify-center w-12 text-sm font-medium text-gray-600',
  productCodeWrapper: 'min-w-[200px]',
  quantityWrapper: 'min-w-[120px]',

  // 商品情報ボックス共通スタイル
  infoBox: 'flex gap-2 p-2 rounded-md',
  infoBoxContent: 'flex items-center gap-2 flex-1',
  labelText: 'font-semibold text-xs whitespace-nowrap',
  detailText: 'm-0 text-xs text-gray-700 leading-tight',
  separator: 'mx-1 text-gray-400',

  // 画像スタイル
  imageSmall: 'flex-shrink-0 w-10 h-10 rounded overflow-hidden bg-white border border-gray-200',
  imageMedium: 'flex-shrink-0 w-12 h-12 rounded overflow-hidden bg-white border border-gray-200',

  // 状態別スタイル
  loading: 'flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg',
  error: 'flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg',
  discontinued: 'flex gap-2 p-2 bg-orange-50 border border-orange-300 rounded-md',
  alternative: 'flex gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md',
  normal: 'flex gap-2 p-2 bg-white rounded-md hover:bg-gray-50 transition-colors cursor-pointer group',

  // ボタンスタイル
  switchButton: 'px-3 py-1 h-fit bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 active:bg-blue-800 transition-colors',
  resetButton: 'flex items-center justify-center w-8 h-8 rounded-full transition-all duration-150',
} as const;

/**
 * ローディングインジケーター
 */
const LoadingIndicator = () => (
  <div className={STYLES.loading}>
    <div className="w-5 h-5 text-blue-600">
      <svg
        className="w-full h-full animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
    <span className="text-sm text-blue-700">検索中...</span>
  </div>
);

/**
 * エラー表示
 */
const ErrorDisplay = ({ error }: { error: ProductSearchError }) => (
  <div className={STYLES.error}>
    <span className="text-red-600">❌</span>
    <span className="text-sm text-red-700">{error.message}</span>
  </div>
);

/**
 * 商品情報ボックス（共通コンポーネント）
 */
interface ProductInfoBoxProps {
  label: string;
  labelColor: string;
  imageUrl: string;
  imageName: string;
  imageSize: 40 | 48;
  imageClassName?: string;
  boxClassName: string;
  children: React.ReactNode;
}

const ProductInfoBox = ({
  label,
  labelColor,
  imageUrl,
  imageName,
  imageSize,
  imageClassName = 'w-full h-full object-cover',
  boxClassName,
  children,
}: ProductInfoBoxProps) => (
  <div className={boxClassName}>
    <div className={STYLES.infoBoxContent}>
      <span className={`${STYLES.labelText} ${labelColor}`}>{label}</span>

      <div className={imageSize === 40 ? STYLES.imageSmall : STYLES.imageMedium}>
        <Image
          src={imageUrl}
          alt={imageName}
          width={imageSize}
          height={imageSize}
          className={imageClassName}
        />
      </div>

      {children}
    </div>
  </div>
);

/**
 * 中止品情報表示
 */
const DiscontinuedProductInfo = ({ product }: { product: ProductSearchResult }) => (
  <ProductInfoBox
    label="中止品"
    labelColor="text-orange-900"
    imageUrl={product.imageUrl}
    imageName={product.name}
    imageSize={40}
    imageClassName="w-full h-full object-cover grayscale"
    boxClassName={`${STYLES.discontinued} opacity-60`}
  >
    <p className={STYLES.detailText}>
      <span>コード: {product.code}</span>
      {product.discontinuedDate && (
        <>
          <span className={STYLES.separator}>|</span>
          <span>{product.discontinuedDate}廃番</span>
        </>
      )}
      {product.discontinuedReason && (
        <>
          <span className={STYLES.separator}>|</span>
          <span>{product.discontinuedReason}</span>
        </>
      )}
    </p>
  </ProductInfoBox>
);

/**
 * 代替商品情報表示
 */
interface AlternativeProductInfoProps {
  product: ProductSearchResult;
  onSwitch: (code: string) => void;
}

const AlternativeProductInfo = ({ product, onSwitch }: AlternativeProductInfoProps) => {
  if (!product.alternativeProducts || product.alternativeProducts.length === 0) {
    return null;
  }

  const alternative = product.alternativeProducts[0];

  return (
    <div className={STYLES.alternative}>
      <div className={STYLES.infoBoxContent}>
        <span className={`${STYLES.labelText} text-blue-900`}>代替商品</span>

        <div className={STYLES.imageSmall}>
          <Image
            src={alternative.imageUrl}
            alt={alternative.name}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>

        <p className={STYLES.detailText}>
          <span className="font-semibold">{alternative.name}</span>
          <span className={STYLES.separator}>|</span>
          <span>コード: {alternative.code}</span>
          <span className={STYLES.separator}>|</span>
          <span className="font-bold text-emerald-600">
            ¥{alternative.price.toLocaleString()}
          </span>
        </p>
      </div>

      <button
        type="button"
        onClick={() => onSwitch(alternative.code)}
        className={STYLES.switchButton}
      >
        切替
      </button>
    </div>
  );
};

/**
 * 通常商品情報表示
 */
const NormalProductInfo = ({ product }: { product: ProductSearchResult }) => (
  <Link
    href={`/products/${product.id}`}
    className={STYLES.normal}
  >
    <div className={STYLES.imageMedium}>
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={48}
        height={48}
        className="w-full h-full object-cover"
      />
    </div>

    <div className="flex-1 flex flex-col gap-1">
      {/* 1行目: 商品名 + コード */}
      <div className="flex items-center gap-2 flex-wrap">
        <h4 className="m-0 text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
          {product.name}
        </h4>
        <span className="text-gray-300">|</span>
        <p className="m-0 text-xs text-gray-600">コード: {product.code}</p>
      </div>

      {/* 2行目: 価格 + 在庫 */}
      <div className="flex items-center gap-2 flex-wrap">
        <p className="m-0 text-sm font-bold text-emerald-600">
          ¥{product.price.toLocaleString()}
          <span className="ml-1 text-xs font-normal text-gray-600">
            （税込 ¥{product.priceWithTax.toLocaleString()}）
          </span>
        </p>
        <span className="text-gray-300">|</span>
        {product.isAvailable ? (
          <span className="inline-block px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            在庫: {product.stock}個
          </span>
        ) : (
          <span className="inline-block px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
            在庫切れ
          </span>
        )}
      </div>
    </div>
  </Link>
);

/**
 * リセットボタン
 */
interface ResetButtonProps {
  hasContent: boolean;
  onReset: () => void;
}

const ResetButton = ({ hasContent, onReset }: ResetButtonProps) => (
  <button
    type="button"
    onClick={onReset}
    disabled={!hasContent}
    className={`
      ${STYLES.resetButton}
      ${
        hasContent
          ? 'text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer'
          : 'text-gray-200 cursor-not-allowed'
      }
    `}
    aria-label="入力をリセット"
    title="入力をリセット"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </button>
);

/**
 * QuickOrderRow
 *
 * クイックオーダーの1行入力（行番号 + 商品コード + 数量 + プレビュー）
 *
 * @example
 * <QuickOrderRow
 *   rowIndex={1}
 *   productCode={productCode}
 *   quantity={quantity}
 *   onProductCodeChange={handleCodeChange}
 *   onQuantityChange={handleQuantityChange}
 *   product={product}
 *   error={error}
 *   isSearching={isSearching}
 * />
 */
export default function QuickOrderRow({
  rowIndex,
  productCode,
  quantity,
  onProductCodeChange,
  onQuantityChange,
  onReset,
  onSwitchToAlternative,
  product,
  error,
  isSearching,
}: QuickOrderRowProps) {
  const hasContent = productCode.trim().length > 0;

  const handleSwitchToAlternative = (alternativeCode: string) => {
    onSwitchToAlternative?.(alternativeCode);
  };

  return (
    <div className={STYLES.container}>
      {/* 行番号 */}
      <div className={STYLES.rowNumber}>
        {rowIndex}
      </div>

      {/* 商品コード入力 */}
      <div className={STYLES.productCodeWrapper}>
        <ProductCodeInput
          value={productCode}
          onChange={onProductCodeChange}
          isSearching={isSearching}
          placeholder="商品コード"
          label=""
          id={`product-code-${rowIndex}`}
        />
      </div>

      {/* 数量入力 */}
      <div className={STYLES.quantityWrapper}>
        <NumberInput
          value={quantity}
          onChange={onQuantityChange}
          min={1}
          showStepper={true}
          label=""
          id={`quantity-${rowIndex}`}
          disabled={!hasContent}
        />
      </div>

      {/* 商品プレビュー */}
      <div>
        {isSearching && <LoadingIndicator />}

        {error && !product && !isSearching && <ErrorDisplay error={error} />}

        {product && !isSearching && product.discontinued && (
          <div className="flex flex-col gap-2">
            <DiscontinuedProductInfo product={product} />
            <AlternativeProductInfo
              product={product}
              onSwitch={handleSwitchToAlternative}
            />
          </div>
        )}

        {product && !isSearching && !product.discontinued && (
          <NormalProductInfo product={product} />
        )}
      </div>

      {/* リセットボタン */}
      <div className="flex items-center">
        <ResetButton hasContent={hasContent} onReset={onReset} />
      </div>
    </div>
  );
}
