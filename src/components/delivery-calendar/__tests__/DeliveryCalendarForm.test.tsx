import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeliveryCalendarForm from '../DeliveryCalendarForm';

// toast モック
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// fetch モック
const mockFetch = jest.fn();
global.fetch = mockFetch;

/** 配送パターンのラジオボタンをクリックするヘルパー */
const clickDeliveryPattern = async (pattern: 'weekdays' | 'weekdaysAndSaturday' | 'custom') => {
  const radio = screen.getByDisplayValue(pattern);
  await userEvent.click(radio);
};

describe('DeliveryCalendarForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: '配送カレンダーを登録しました。' }),
    });
  });

  describe('初期表示', () => {
    it('ページタイトルが表示される', () => {
      render(<DeliveryCalendarForm />);
      expect(screen.getByText('配送カレンダー登録機能(スマートデリバリー)')).toBeInTheDocument();
    });

    it('3つの配送パターンオプションが表示される', () => {
      render(<DeliveryCalendarForm />);
      expect(screen.getByText('月〜金曜日配送')).toBeInTheDocument();
      expect(screen.getByText('月〜土曜日配送')).toBeInTheDocument();
      expect(screen.getByText('配送日カスタマイズ')).toBeInTheDocument();
    });

    it('初期状態では曜日選択テーブルは非表示', () => {
      render(<DeliveryCalendarForm />);
      expect(screen.queryByRole('checkbox', { name: '月曜' })).not.toBeInTheDocument();
    });

    it('注意事項が表示される', () => {
      render(<DeliveryCalendarForm />);
      expect(screen.getByText('【注意事項】')).toBeInTheDocument();
      expect(screen.getByText(/ご注文ごとに希望納期を入れることで設定曜日外の配送も可能です/)).toBeInTheDocument();
    });

    it('登録ボタンが表示される', () => {
      render(<DeliveryCalendarForm />);
      expect(screen.getByRole('button', { name: '登録する' })).toBeInTheDocument();
    });
  });

  describe('配送パターン選択', () => {
    it('月〜金曜日配送を選択できる', async () => {
      render(<DeliveryCalendarForm />);
      const radio = screen.getByDisplayValue('weekdays');
      await userEvent.click(radio);
      expect(radio).toBeChecked();
    });

    it('月〜土曜日配送を選択できる', async () => {
      render(<DeliveryCalendarForm />);
      const radio = screen.getByDisplayValue('weekdaysAndSaturday');
      await userEvent.click(radio);
      expect(radio).toBeChecked();
    });

    it('カスタマイズを選択すると曜日選択テーブルが表示される', async () => {
      render(<DeliveryCalendarForm />);
      await clickDeliveryPattern('custom');

      expect(screen.getByText('月曜')).toBeInTheDocument();
      expect(screen.getByText('火曜')).toBeInTheDocument();
      expect(screen.getByText('水曜')).toBeInTheDocument();
      expect(screen.getByText('木曜')).toBeInTheDocument();
      expect(screen.getByText('金曜')).toBeInTheDocument();
      expect(screen.getByText('土曜')).toBeInTheDocument();
    });

    it('カスタマイズから他のオプションに切り替えると曜日選択テーブルが非表示になる', async () => {
      render(<DeliveryCalendarForm />);

      // カスタマイズを選択
      await clickDeliveryPattern('custom');
      expect(screen.getByRole('checkbox', { name: '月曜' })).toBeInTheDocument();

      // 月〜金曜日配送に切り替え
      await clickDeliveryPattern('weekdays');
      expect(screen.queryByRole('checkbox', { name: '月曜' })).not.toBeInTheDocument();
    });
  });

  describe('曜日選択（カスタマイズ時）', () => {
    it('曜日をチェックできる', async () => {
      render(<DeliveryCalendarForm />);
      await clickDeliveryPattern('custom');

      const mondayCheckbox = screen.getByRole('checkbox', { name: '月曜' });
      await userEvent.click(mondayCheckbox);
      expect(mondayCheckbox).toBeChecked();
    });

    it('複数の曜日を選択できる', async () => {
      render(<DeliveryCalendarForm />);
      await clickDeliveryPattern('custom');

      await userEvent.click(screen.getByRole('checkbox', { name: '月曜' }));
      await userEvent.click(screen.getByRole('checkbox', { name: '水曜' }));
      await userEvent.click(screen.getByRole('checkbox', { name: '金曜' }));

      expect(screen.getByRole('checkbox', { name: '月曜' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: '水曜' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: '金曜' })).toBeChecked();
    });

    it('選択した曜日のチェックを外せる', async () => {
      render(<DeliveryCalendarForm />);
      await clickDeliveryPattern('custom');

      const mondayCheckbox = screen.getByRole('checkbox', { name: '月曜' });
      await userEvent.click(mondayCheckbox);
      expect(mondayCheckbox).toBeChecked();

      await userEvent.click(mondayCheckbox);
      expect(mondayCheckbox).not.toBeChecked();
    });
  });

  describe('バリデーション', () => {
    it('カスタマイズで曜日未選択の場合エラーメッセージが表示される', async () => {
      render(<DeliveryCalendarForm />);
      await clickDeliveryPattern('custom');
      await userEvent.click(screen.getByRole('button', { name: '登録する' }));

      expect(screen.getByText('必ず一つ以上にチェックを入れてください')).toBeInTheDocument();
    });

    it('曜日を選択するとエラーメッセージが消える', async () => {
      render(<DeliveryCalendarForm />);
      await clickDeliveryPattern('custom');
      await userEvent.click(screen.getByRole('button', { name: '登録する' }));

      expect(screen.getByText('必ず一つ以上にチェックを入れてください')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('checkbox', { name: '月曜' }));
      expect(screen.queryByText('必ず一つ以上にチェックを入れてください')).not.toBeInTheDocument();
    });
  });

  describe('フォーム送信', () => {
    it('月〜金曜日配送で登録APIが呼ばれる', async () => {
      render(<DeliveryCalendarForm />);
      await clickDeliveryPattern('weekdays');
      await userEvent.click(screen.getByRole('button', { name: '登録する' }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/delivery-calendar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deliveryPattern: 'weekdays' }),
        });
      });
    });

    it('月〜土曜日配送で登録APIが呼ばれる', async () => {
      render(<DeliveryCalendarForm />);
      await clickDeliveryPattern('weekdaysAndSaturday');
      await userEvent.click(screen.getByRole('button', { name: '登録する' }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/delivery-calendar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deliveryPattern: 'weekdaysAndSaturday' }),
        });
      });
    });

    it('カスタマイズで選択した曜日が送信される', async () => {
      render(<DeliveryCalendarForm />);
      await clickDeliveryPattern('custom');
      await userEvent.click(screen.getByRole('checkbox', { name: '月曜' }));
      await userEvent.click(screen.getByRole('checkbox', { name: '水曜' }));
      await userEvent.click(screen.getByRole('button', { name: '登録する' }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/delivery-calendar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deliveryPattern: 'custom',
            customDays: ['monday', 'wednesday'],
          }),
        });
      });
    });

    it('送信中はボタンが無効化される', async () => {
      mockFetch.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

      render(<DeliveryCalendarForm />);
      await clickDeliveryPattern('weekdays');

      const button = screen.getByRole('button', { name: '登録する' });
      fireEvent.click(button);

      await waitFor(() => {
        expect(button).toBeDisabled();
      });
    });

    it('API成功時にトースト通知が表示される', async () => {
      const toast = jest.requireMock('react-hot-toast');

      render(<DeliveryCalendarForm />);
      await clickDeliveryPattern('weekdays');
      await userEvent.click(screen.getByRole('button', { name: '登録する' }));

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('配送カレンダーを登録しました');
      });
    });

    it('APIエラー時にエラートーストが表示される', async () => {
      const toast = jest.requireMock('react-hot-toast');
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ success: false, message: 'エラーが発生しました' }),
      });

      render(<DeliveryCalendarForm />);
      await clickDeliveryPattern('weekdays');
      await userEvent.click(screen.getByRole('button', { name: '登録する' }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('登録に失敗しました');
      });
    });
  });
});
