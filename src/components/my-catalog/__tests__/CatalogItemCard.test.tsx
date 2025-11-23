import { render, screen, fireEvent } from '@testing-library/react';
import CatalogItemCard from '../CatalogItemCard';
import type { CatalogItem } from '@/types/catalog';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { src: string; alt: string }) => (
    <img src={props.src} alt={props.alt} data-testid="product-image" />
  ),
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockItem: CatalogItem = {
  id: 'item-1',
  folderId: 'company-1',
  productId: 'prod-40912',
  productCode: '40912',
  productName: 'ケシポン箱用 交換式 ホワイト',
  brandName: 'プラス',
  partNumber: 'IS-590CM',
  imageUrl: '/img/product/A2201551.jpg',
  standardPrice: 1100,
  salePrice: 935,
  memo: 'A001',
  orderComment: 'アイウエオ',
  accountCode: '01',
  displayOrder: 1,
  stock: 100,
};

describe('CatalogItemCard', () => {
  it('商品名が正しく表示される', () => {
    render(<CatalogItemCard item={mockItem} />);
    expect(screen.getByText('ケシポン箱用 交換式 ホワイト')).toBeInTheDocument();
  });

  it('商品コードが正しく表示される', () => {
    render(<CatalogItemCard item={mockItem} />);
    expect(screen.getByText('40912')).toBeInTheDocument();
  });

  it('販売価格が正しく表示される', () => {
    render(<CatalogItemCard item={mockItem} />);
    expect(screen.getByText('¥935')).toBeInTheDocument();
  });

  it('定価が異なる場合、定価と割引率が表示される', () => {
    render(<CatalogItemCard item={mockItem} />);
    expect(screen.getByText('¥1,100')).toBeInTheDocument();
    expect(screen.getByText('15%OFF')).toBeInTheDocument();
  });

  it('ブランド名と型番が正しく表示される', () => {
    render(<CatalogItemCard item={mockItem} />);
    expect(screen.getByText(/プラス/)).toBeInTheDocument();
    expect(screen.getByText(/IS-590CM/)).toBeInTheDocument();
  });

  it('チェックボックスの選択状態が正しく反映される', () => {
    render(<CatalogItemCard item={mockItem} isSelected={true} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('チェックボックスをクリックするとonSelectが呼ばれる', () => {
    const onSelect = jest.fn();
    render(<CatalogItemCard item={mockItem} onSelect={onSelect} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(onSelect).toHaveBeenCalledWith('item-1');
  });

  it('数量を増減できる', () => {
    const onQuantityChange = jest.fn();
    render(
      <CatalogItemCard
        item={mockItem}
        quantity={5}
        onQuantityChange={onQuantityChange}
      />
    );

    // 増加ボタンをクリック
    const increaseButton = screen.getByLabelText('数量を増やす');
    fireEvent.click(increaseButton);
    expect(onQuantityChange).toHaveBeenCalledWith('item-1', 6);

    // 減少ボタンをクリック
    const decreaseButton = screen.getByLabelText('数量を減らす');
    fireEvent.click(decreaseButton);
    expect(onQuantityChange).toHaveBeenCalledWith('item-1', 4);
  });

  it('数量が1のとき、減少ボタンをクリックしても1未満にならない', () => {
    const onQuantityChange = jest.fn();
    render(
      <CatalogItemCard
        item={mockItem}
        quantity={1}
        onQuantityChange={onQuantityChange}
      />
    );

    const decreaseButton = screen.getByLabelText('数量を減らす');
    fireEvent.click(decreaseButton);
    expect(onQuantityChange).toHaveBeenCalledWith('item-1', 1);
  });

  it('メモ欄に入力できる', () => {
    const onMemoChange = jest.fn();
    render(
      <CatalogItemCard
        item={mockItem}
        memo="テストメモ"
        onMemoChange={onMemoChange}
      />
    );

    const memoInput = screen.getByPlaceholderText('メモを入力...');
    expect(memoInput).toHaveValue('テストメモ');

    fireEvent.change(memoInput, { target: { value: '新しいメモ' } });
    expect(onMemoChange).toHaveBeenCalledWith('item-1', '新しいメモ');
  });

  it('memoプロパティが未定義の場合、item.memoが表示される', () => {
    render(<CatalogItemCard item={mockItem} />);

    const memoInput = screen.getByPlaceholderText('メモを入力...');
    expect(memoInput).toHaveValue('A001');
  });

  it('商品画像がない場合、プレースホルダーが表示される', () => {
    const itemWithoutImage = { ...mockItem, imageUrl: '' };
    render(<CatalogItemCard item={itemWithoutImage} />);

    expect(screen.queryByTestId('product-image')).not.toBeInTheDocument();
  });

  it('商品詳細へのリンクが正しく設定される', () => {
    render(<CatalogItemCard item={mockItem} />);

    const links = screen.getAllByRole('link');
    const productLink = links.find((link) =>
      link.getAttribute('href')?.includes('/products/')
    );
    expect(productLink).toHaveAttribute('href', '/products/prod-40912');
  });
});
