/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock next/navigation - must be before component import
jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ folderId: 'company-1' })),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={props.src} alt={props.alt} data-testid="product-image" />;
  },
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock layout components
jest.mock('@/components/layout/Header', () => ({
  __esModule: true,
  default: () => <header data-testid="header">Header</header>,
}));

jest.mock('@/components/layout/Footer', () => ({
  __esModule: true,
  default: () => <footer data-testid="footer">Footer</footer>,
}));

jest.mock('@/components/common/Breadcrumb', () => ({
  __esModule: true,
  default: () => <nav data-testid="breadcrumb">Breadcrumb</nav>,
}));

jest.mock('@/components/mypage/MyPageSidebar', () => ({
  __esModule: true,
  default: () => <aside data-testid="sidebar">Sidebar</aside>,
}));

// Import after mocks
import CatalogFolderDetailPage from '../[folderId]/page';
import { useParams } from 'next/navigation';

const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;

describe('CatalogFolderDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ folderId: 'company-1' });
  });

  it('フォルダ名が正しく表示される', () => {
    render(<CatalogFolderDetailPage />);
    expect(screen.getByText('保存水')).toBeInTheDocument();
  });

  it('商品一覧が表示される', () => {
    render(<CatalogFolderDetailPage />);
    expect(screen.getByText('ケシポン箱用 交換式 ホワイト')).toBeInTheDocument();
  });

  it('検索入力フィールドが存在する', () => {
    render(<CatalogFolderDetailPage />);
    const searchInput = screen.getByPlaceholderText('商品名や商品コードで検索');
    expect(searchInput).toBeInTheDocument();
  });

  it('全選択チェックボックスが存在する', () => {
    render(<CatalogFolderDetailPage />);
    const allCheckboxes = screen.getAllByRole('checkbox');
    expect(allCheckboxes.length).toBeGreaterThan(0);
  });

  it('ソートセレクトボックスが存在する', () => {
    render(<CatalogFolderDetailPage />);
    const sortSelect = screen.getByRole('combobox');
    expect(sortSelect).toBeInTheDocument();
  });

  it('マイカタログ一覧へのリンクが存在する', () => {
    render(<CatalogFolderDetailPage />);
    const backLink = screen.getByText('マイカタログ一覧');
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest('a')).toHaveAttribute('href', '/my-catalog');
  });

  it('商品件数が表示される', () => {
    render(<CatalogFolderDetailPage />);
    expect(screen.getByText(/件の商品/)).toBeInTheDocument();
  });

  it('選択商品をカートに追加ボタンが存在する', () => {
    render(<CatalogFolderDetailPage />);
    const addToCartButton = screen.getByText('選択商品をカートに追加');
    expect(addToCartButton).toBeInTheDocument();
    expect(addToCartButton).toBeDisabled();
  });
});

describe('CatalogFolderDetailPage - フォルダが存在しない場合', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ folderId: 'non-existent-folder' });
  });

  it('フォルダが見つからないメッセージが表示される', () => {
    render(<CatalogFolderDetailPage />);
    expect(screen.getByText('フォルダが見つかりません')).toBeInTheDocument();
  });

  it('マイカタログ一覧に戻るリンクが表示される', () => {
    render(<CatalogFolderDetailPage />);
    const backLink = screen.getByText('マイカタログ一覧に戻る');
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest('a')).toHaveAttribute('href', '/my-catalog');
  });
});
