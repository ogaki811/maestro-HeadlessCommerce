import { render, screen } from '@testing-library/react';
import SectionCard from '../SectionCard';

describe('SectionCard', () => {
  it('オレンジヘッダーで正しくレンダリングされる', () => {
    render(
      <SectionCard title="ご登録情報" headerColor="orange">
        <p>テストコンテンツ</p>
      </SectionCard>
    );

    expect(screen.getByText('ご登録情報')).toBeInTheDocument();
    expect(screen.getByText('テストコンテンツ')).toBeInTheDocument();
  });

  it('青緑ヘッダーで正しくレンダリングされる', () => {
    render(
      <SectionCard title="販売店担当営業情報" headerColor="teal">
        <p>テストコンテンツ</p>
      </SectionCard>
    );

    expect(screen.getByText('販売店担当営業情報')).toBeInTheDocument();
  });

  it('アクションリンクが表示される', () => {
    render(
      <SectionCard
        title="ご登録情報"
        headerColor="orange"
        actionLink={{ text: 'ご登録情報の修正', href: '/mypage/settings' }}
      >
        <p>テストコンテンツ</p>
      </SectionCard>
    );

    const link = screen.getByRole('link', { name: 'ご登録情報の修正' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/mypage/settings');
  });

  it('アクションリンクなしで正しくレンダリングされる', () => {
    render(
      <SectionCard title="ポイント情報" headerColor="orange">
        <p>テストコンテンツ</p>
      </SectionCard>
    );

    expect(screen.getByText('ポイント情報')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('子要素が正しく表示される', () => {
    render(
      <SectionCard title="テストセクション" headerColor="orange">
        <div data-testid="child-content">
          <p>複数の子要素</p>
          <span>テスト</span>
        </div>
      </SectionCard>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('複数の子要素')).toBeInTheDocument();
    expect(screen.getByText('テスト')).toBeInTheDocument();
  });
});
