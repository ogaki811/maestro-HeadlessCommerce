/**
 * CategorySelector Component Test
 * カテゴリセレクターコンポーネント テスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import CategorySelector from '../CategorySelector';
import type { CategorySelection } from '@/types/category';

describe('CategorySelector', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe('レンダリング', () => {
    it('初期状態で「すべてのカテゴリ」が表示されること', () => {
      render(<CategorySelector value={undefined} onChange={mockOnChange} />);
      expect(screen.getByText('すべてのカテゴリ')).toBeInTheDocument();
    });

    it('プルダウンアイコンが表示されること', () => {
      const { container } = render(<CategorySelector value={undefined} onChange={mockOnChange} />);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('大カテゴリ選択', () => {
    it('クリックで大カテゴリ一覧が表示されること', () => {
      render(<CategorySelector value={undefined} onChange={mockOnChange} />);

      const button = screen.getByText('すべてのカテゴリ');
      fireEvent.click(button);

      expect(screen.getByText('文具・事務用品')).toBeInTheDocument();
      expect(screen.getByText('家具')).toBeInTheDocument();
      expect(screen.getByText('電化製品')).toBeInTheDocument();
      expect(screen.getByText('収納用品')).toBeInTheDocument();
    });

    it('大カテゴリ選択時にonChangeが呼ばれること', () => {
      render(<CategorySelector value={undefined} onChange={mockOnChange} />);

      const button = screen.getByText('すべてのカテゴリ');
      fireEvent.click(button);

      const stationery = screen.getByText('文具・事務用品');
      fireEvent.click(stationery);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          large: expect.objectContaining({
            id: 'stationery',
            name: '文具・事務用品',
          }),
        })
      );
    });
  });

  describe('中カテゴリ選択', () => {
    it('大カテゴリ選択後、中カテゴリ一覧が表示されること', () => {
      render(<CategorySelector value={undefined} onChange={mockOnChange} />);

      // ドロップダウンを開く
      const button = screen.getByText('すべてのカテゴリ');
      fireEvent.click(button);

      // 大カテゴリにホバーして中カテゴリを表示
      const stationery = screen.getByText('文具・事務用品');
      fireEvent.mouseEnter(stationery);

      expect(screen.getByText('筆記用具')).toBeInTheDocument();
      expect(screen.getByText('ノート類')).toBeInTheDocument();
    });

    it('中カテゴリ選択時にonChangeが呼ばれること', () => {
      render(<CategorySelector value={undefined} onChange={mockOnChange} />);

      // ドロップダウンを開く
      const button = screen.getByText('すべてのカテゴリ');
      fireEvent.click(button);

      // 大カテゴリにホバー
      const stationery = screen.getByText('文具・事務用品');
      fireEvent.mouseEnter(stationery);

      // 中カテゴリをクリックして選択
      const writingInstruments = screen.getByText('筆記用具');
      fireEvent.click(writingInstruments);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          large: expect.objectContaining({ id: 'stationery' }),
          medium: expect.objectContaining({
            id: 'writing-instruments',
            name: '筆記用具',
          }),
        })
      );
    });
  });

  describe('小カテゴリ選択', () => {
    it('中カテゴリ選択後、小カテゴリ一覧が表示されること', () => {
      render(<CategorySelector value={undefined} onChange={mockOnChange} />);

      // ドロップダウンを開く
      const button = screen.getByText('すべてのカテゴリ');
      fireEvent.click(button);

      // 大カテゴリにホバー
      const stationery = screen.getByText('文具・事務用品');
      fireEvent.mouseEnter(stationery);

      // 中カテゴリにホバーして小カテゴリを表示
      const writingInstruments = screen.getByText('筆記用具');
      fireEvent.mouseEnter(writingInstruments);

      expect(screen.getByText('ボールペン')).toBeInTheDocument();
      expect(screen.getByText('シャープペンシル')).toBeInTheDocument();
    });

    it('小カテゴリ選択時にonChangeが呼ばれること', () => {
      render(<CategorySelector value={undefined} onChange={mockOnChange} />);

      // ドロップダウンを開く
      const button = screen.getByText('すべてのカテゴリ');
      fireEvent.click(button);

      // 大カテゴリにホバー
      const stationery = screen.getByText('文具・事務用品');
      fireEvent.mouseEnter(stationery);

      // 中カテゴリにホバー
      const writingInstruments = screen.getByText('筆記用具');
      fireEvent.mouseEnter(writingInstruments);

      // 小カテゴリをクリックして選択
      const ballpointPens = screen.getByText('ボールペン');
      fireEvent.click(ballpointPens);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          large: expect.objectContaining({ id: 'stationery' }),
          medium: expect.objectContaining({ id: 'writing-instruments' }),
          small: expect.objectContaining({
            id: 'ballpoint-pens',
            name: 'ボールペン',
          }),
        })
      );
    });
  });

  describe('表示テキスト', () => {
    it('大カテゴリのみ選択時、カテゴリ名が表示されること', () => {
      const selection: CategorySelection = {
        large: {
          id: 'stationery',
          name: '文具・事務用品',
          slug: 'stationery',
          level: 'large',
        },
      };

      render(<CategorySelector value={selection} onChange={mockOnChange} />);
      expect(screen.getByText('文具・事務用品')).toBeInTheDocument();
    });

    it('大中カテゴリ選択時、パス表示されること', () => {
      const selection: CategorySelection = {
        large: {
          id: 'stationery',
          name: '文具・事務用品',
          slug: 'stationery',
          level: 'large',
        },
        medium: {
          id: 'writing-instruments',
          name: '筆記用具',
          slug: 'writing-instruments',
          level: 'medium',
          parentId: 'stationery',
        },
      };

      render(<CategorySelector value={selection} onChange={mockOnChange} />);
      expect(screen.getByText('文具・事務用品 > 筆記用具')).toBeInTheDocument();
    });

    it('大中小カテゴリ選択時、フルパス表示されること', () => {
      const selection: CategorySelection = {
        large: {
          id: 'stationery',
          name: '文具・事務用品',
          slug: 'stationery',
          level: 'large',
        },
        medium: {
          id: 'writing-instruments',
          name: '筆記用具',
          slug: 'writing-instruments',
          level: 'medium',
          parentId: 'stationery',
        },
        small: {
          id: 'ballpoint-pens',
          name: 'ボールペン',
          slug: 'ballpoint-pens',
          level: 'small',
          parentId: 'writing-instruments',
        },
      };

      render(<CategorySelector value={selection} onChange={mockOnChange} />);
      expect(screen.getByText('文具・事務用品 > 筆記用具 > ボールペン')).toBeInTheDocument();
    });
  });

  describe('クリアボタン', () => {
    it('カテゴリ選択時にクリアボタンが表示されること', () => {
      const selection: CategorySelection = {
        large: {
          id: 'stationery',
          name: '文具・事務用品',
          slug: 'stationery',
          level: 'large',
        },
      };

      render(<CategorySelector value={selection} onChange={mockOnChange} />);
      const clearButton = screen.getByLabelText('カテゴリをクリア');
      expect(clearButton).toBeInTheDocument();
    });

    it('クリアボタンクリックでundefinedが返されること', () => {
      const selection: CategorySelection = {
        large: {
          id: 'stationery',
          name: '文具・事務用品',
          slug: 'stationery',
          level: 'large',
        },
      };

      render(<CategorySelector value={selection} onChange={mockOnChange} />);
      const clearButton = screen.getByLabelText('カテゴリをクリア');
      fireEvent.click(clearButton);

      expect(mockOnChange).toHaveBeenCalledWith(undefined);
    });
  });
});
