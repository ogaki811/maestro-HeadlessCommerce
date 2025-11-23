import { render, screen } from '@testing-library/react';
import ContactCard from '../ContactCard';

describe('ContactCard', () => {
  const mockProps = {
    name: '長谷べすず',
    company: 'スマートオフィス販売店SOⅡ企画',
    tel: '042-329-3103',
    mobile: '070-8695-6076',
    email: 'ahasebe@jointex.jp',
  };

  it('営業担当者情報が正しく表示される', () => {
    render(<ContactCard {...mockProps} />);

    expect(screen.getByText(/長谷べすず/)).toBeInTheDocument();
    expect(screen.getByText(/スマートオフィス販売店SOⅡ企画/)).toBeInTheDocument();
    expect(screen.getByText(/042-329-3103/)).toBeInTheDocument();
    expect(screen.getByText(/070-8695-6076/)).toBeInTheDocument();
    expect(screen.getByText(/ahasebe@jointex.jp/)).toBeInTheDocument();
  });

  it('FAX情報がある場合に表示される', () => {
    render(<ContactCard {...mockProps} fax="03-1234-5678" />);

    expect(screen.getByText(/03-1234-5678/)).toBeInTheDocument();
  });

  it('FAX情報がない場合は空として表示される', () => {
    render(<ContactCard {...mockProps} />);

    const faxLabel = screen.getByText('FAX');
    expect(faxLabel).toBeInTheDocument();
    // FAXの値部分はコロンのみ（値なし）
    expect(faxLabel.parentElement?.textContent).toContain('FAX');
    expect(faxLabel.parentElement?.textContent).toContain(':');
  });

  it('アバターURLがある場合に画像が表示される', () => {
    render(<ContactCard {...mockProps} avatarUrl="/img/avatars/sales-rep.svg" />);

    const avatar = screen.getByRole('img', { name: '営業担当者' });
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', '/img/avatars/sales-rep.svg');
  });

  it('注意書きが表示される', () => {
    render(
      <ContactCard
        {...mockProps}
        note="※ご請求に関しては、販売店までご連絡下さい。"
      />
    );

    expect(
      screen.getByText(/※ご請求に関しては、販売店までご連絡下さい。/)
    ).toBeInTheDocument();
  });
});
