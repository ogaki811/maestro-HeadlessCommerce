/**
 * QuickOrderRow Component Test
 * クイックオーダー1行入力 テスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import QuickOrderRow from '../QuickOrderRow';
import type { ProductSearchResult, ProductSearchError } from '@/hooks/useProductSearch';

describe('QuickOrderRow', () => {
  const mockOnProductCodeChange = jest.fn();
  const mockOnQuantityChange = jest.fn();

  const mockProduct: ProductSearchResult = {
    id: 'product-1',
    code: 'ABC123',
    name: 'テスト商品',
    description: 'テスト商品の説明',
    price: 1000,
    priceWithTax: 1100,
    imageUrl: 'https://example.com/product.jpg',
    stock: 10,
    category: 'category-1',
    isAvailable: true,
  };

  const mockError: ProductSearchError = {
    code: 'NOT_FOUND',
    message: '商品が見つかりません',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('行番号が正しく表示されること', () => {
    render(
      <QuickOrderRow
        rowIndex={5}
        productCode=""
        quantity={1}
        onProductCodeChange={mockOnProductCodeChange}
        onQuantityChange={mockOnQuantityChange}
        product={null}
        error={null}
        isSearching={false}
      />
    );

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('商品コード入力時にonProductCodeChangeが呼ばれること', () => {
    render(
      <QuickOrderRow
        rowIndex={1}
        productCode=""
        quantity={1}
        onProductCodeChange={mockOnProductCodeChange}
        onQuantityChange={mockOnQuantityChange}
        product={null}
        error={null}
        isSearching={false}
      />
    );

    const input = screen.getByPlaceholderText('商品コード');
    fireEvent.change(input, { target: { value: 'ABC123' } });

    expect(mockOnProductCodeChange).toHaveBeenCalledWith('ABC123');
  });

  it('数量変更時にonQuantityChangeが呼ばれること', () => {
    render(
      <QuickOrderRow
        rowIndex={1}
        productCode=""
        quantity={1}
        onProductCodeChange={mockOnProductCodeChange}
        onQuantityChange={mockOnQuantityChange}
        product={null}
        error={null}
        isSearching={false}
      />
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '5' } });

    expect(mockOnQuantityChange).toHaveBeenCalledWith(5);
  });

  it('検索中インジケーターが表示されること', () => {
    render(
      <QuickOrderRow
        rowIndex={1}
        productCode="ABC"
        quantity={1}
        onProductCodeChange={mockOnProductCodeChange}
        onQuantityChange={mockOnQuantityChange}
        product={null}
        error={null}
        isSearching={true}
      />
    );

    expect(screen.getByText('検索中...')).toBeInTheDocument();
  });

  it('商品情報が正しく表示されること', () => {
    render(
      <QuickOrderRow
        rowIndex={1}
        productCode="ABC123"
        quantity={2}
        onProductCodeChange={mockOnProductCodeChange}
        onQuantityChange={mockOnQuantityChange}
        product={mockProduct}
        error={null}
        isSearching={false}
      />
    );

    expect(screen.getByText('テスト商品')).toBeInTheDocument();
    expect(screen.getByText('¥1,000')).toBeInTheDocument();
    expect(screen.getByText('在庫: 10個')).toBeInTheDocument();
  });

  it('エラーメッセージが表示されること', () => {
    render(
      <QuickOrderRow
        rowIndex={1}
        productCode="INVALID"
        quantity={1}
        onProductCodeChange={mockOnProductCodeChange}
        onQuantityChange={mockOnQuantityChange}
        product={null}
        error={mockError}
        isSearching={false}
      />
    );

    // エラーメッセージが複数箇所に表示される（入力欄下 + プレビューエリア）
    expect(screen.getAllByText('商品が見つかりません').length).toBeGreaterThanOrEqual(1);
  });

  it('在庫切れ商品の場合に警告が表示されること', () => {
    const outOfStockProduct: ProductSearchResult = {
      ...mockProduct,
      isAvailable: false,
      stock: 0,
    };

    render(
      <QuickOrderRow
        rowIndex={1}
        productCode="ABC123"
        quantity={1}
        onProductCodeChange={mockOnProductCodeChange}
        onQuantityChange={mockOnQuantityChange}
        product={outOfStockProduct}
        error={null}
        isSearching={false}
      />
    );

    expect(screen.getByText('在庫切れ')).toBeInTheDocument();
  });

  it('商品情報がない場合は何も表示されないこと', () => {
    const { container } = render(
      <QuickOrderRow
        rowIndex={1}
        productCode=""
        quantity={1}
        onProductCodeChange={mockOnProductCodeChange}
        onQuantityChange={mockOnQuantityChange}
        product={null}
        error={null}
        isSearching={false}
      />
    );

    // 行番号、入力欄、数量のみ表示（プレビューエリアなし）
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.queryByText('検索中...')).not.toBeInTheDocument();
    expect(screen.queryByText('商品が見つかりません')).not.toBeInTheDocument();
  });

  describe('廃番商品表示（コンパクトレイアウト）', () => {
    const mockOnReset = jest.fn();
    const mockOnSwitchToAlternative = jest.fn();

    const discontinuedProduct: ProductSearchResult = {
      id: 'product-discontinued',
      code: 'DM110BK',
      name: 'デスクマット 透明',
      description: '',
      price: 2500,
      priceWithTax: 2750,
      imageUrl: 'https://example.com/dm110bk.jpg',
      stock: 0,
      category: 'furniture',
      isAvailable: false,
      discontinued: true,
      discontinuedDate: '2024-12-01',
      discontinuedReason: 'モデルチェンジのため廃番',
      alternativeProducts: [
        {
          id: 'alt-1',
          code: 'DM220BK',
          name: 'デスクマット 透明 改良版',
          description: '',
          price: 2800,
          priceWithTax: 3080,
          imageUrl: 'https://example.com/dm220bk.jpg',
          stock: 100,
          category: 'furniture',
          isAvailable: true,
        },
        {
          id: 'alt-2',
          code: 'DK1260',
          name: 'デスク 120x60cm',
          description: '',
          price: 18900,
          priceWithTax: 20790,
          imageUrl: 'https://example.com/dk1260.jpg',
          stock: 50,
          category: 'furniture',
          isAvailable: true,
        },
      ],
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('廃番商品の警告が表示されること（コンパクトレイアウト、中止品）', () => {
      render(
        <QuickOrderRow
          rowIndex={1}
          productCode="DM110BK"
          quantity={1}
          onProductCodeChange={mockOnProductCodeChange}
          onQuantityChange={mockOnQuantityChange}
          onReset={mockOnReset}
          onSwitchToAlternative={mockOnSwitchToAlternative}
          product={discontinuedProduct}
          error={null}
          isSearching={false}
        />
      );

      // 中止品の警告テキスト（画像の左に配置）
      expect(screen.getByText('中止品')).toBeInTheDocument();
      expect(screen.getByText(/コード: DM110BK/)).toBeInTheDocument();
      expect(screen.getByText(/2024-12-01廃番/)).toBeInTheDocument();
      expect(screen.getByText(/モデルチェンジのため廃番/)).toBeInTheDocument();
    });

    it('代替商品が1つ表示されること（コンパクト、通常商品と同じ高さ）', () => {
      render(
        <QuickOrderRow
          rowIndex={1}
          productCode="DM110BK"
          quantity={1}
          onProductCodeChange={mockOnProductCodeChange}
          onQuantityChange={mockOnQuantityChange}
          onReset={mockOnReset}
          onSwitchToAlternative={mockOnSwitchToAlternative}
          product={discontinuedProduct}
          error={null}
          isSearching={false}
        />
      );

      // 代替商品リストのヘッダー（件数なし、シンプル）
      expect(screen.getByText(/代替商品/)).toBeInTheDocument();

      // 最初の代替商品のみ表示
      expect(screen.getByText('デスクマット 透明 改良版')).toBeInTheDocument();
      expect(screen.getByText(/コード: DM220BK/)).toBeInTheDocument();
      expect(screen.getByText(/¥2,800/)).toBeInTheDocument();

      // 2番目の代替商品は表示されない
      expect(screen.queryByText('デスク 120x60cm')).not.toBeInTheDocument();
      expect(screen.queryByText('DK1260')).not.toBeInTheDocument();

      // 切り替えボタンが1つだけ表示されること
      const switchButtons = screen.getAllByText('切替');
      expect(switchButtons).toHaveLength(1);
    });

    it('代替商品の切り替えボタンをクリックするとonSwitchToAlternativeが呼ばれること', () => {
      render(
        <QuickOrderRow
          rowIndex={1}
          productCode="DM110BK"
          quantity={1}
          onProductCodeChange={mockOnProductCodeChange}
          onQuantityChange={mockOnQuantityChange}
          onReset={mockOnReset}
          onSwitchToAlternative={mockOnSwitchToAlternative}
          product={discontinuedProduct}
          error={null}
          isSearching={false}
        />
      );

      const switchButton = screen.getByText('切替');

      // 最初の代替商品に切り替え
      fireEvent.click(switchButton);
      expect(mockOnSwitchToAlternative).toHaveBeenCalledWith('DM220BK');
    });
  });

  describe('リセット機能', () => {
    const mockOnReset = jest.fn();

    it('商品コードが入力されている場合、リセットボタンが有効になること', () => {
      render(
        <QuickOrderRow
          rowIndex={1}
          productCode="ABC123"
          quantity={2}
          onProductCodeChange={mockOnProductCodeChange}
          onQuantityChange={mockOnQuantityChange}
          onReset={mockOnReset}
          product={null}
          error={null}
          isSearching={false}
        />
      );

      const resetButton = screen.getByLabelText('入力をリセット');
      expect(resetButton).not.toBeDisabled();

      fireEvent.click(resetButton);
      expect(mockOnReset).toHaveBeenCalled();
    });

    it('商品コードが空の場合、リセットボタンが無効になること', () => {
      render(
        <QuickOrderRow
          rowIndex={1}
          productCode=""
          quantity={1}
          onProductCodeChange={mockOnProductCodeChange}
          onQuantityChange={mockOnQuantityChange}
          onReset={mockOnReset}
          product={null}
          error={null}
          isSearching={false}
        />
      );

      const resetButton = screen.getByLabelText('入力をリセット');
      expect(resetButton).toBeDisabled();
    });
  });
});
