import { render, screen } from '@testing-library/react';
import InfoTable from '../InfoTable';

describe('InfoTable', () => {
  it('1列のデータが正しく表示される', () => {
    const data = [
      { label: 'ご担当者名', value: '小川祐樹 様' },
      { label: 'Web ID', value: '1313111006' },
    ];

    render(<InfoTable data={data} />);

    expect(screen.getByText('ご担当者名')).toBeInTheDocument();
    expect(screen.getByText('小川祐樹 様')).toBeInTheDocument();
    expect(screen.getByText('Web ID')).toBeInTheDocument();
    expect(screen.getByText('1313111006')).toBeInTheDocument();
  });

  it('2列のデータが正しく表示される', () => {
    const data = [
      { label: '管理者権限', value: '一般' },
      { label: '承認者設定', value: 'なし' },
    ];

    render(<InfoTable data={data} columns={2} />);

    expect(screen.getByText('管理者権限')).toBeInTheDocument();
    expect(screen.getByText('一般')).toBeInTheDocument();
    expect(screen.getByText('承認者設定')).toBeInTheDocument();
    expect(screen.getByText('なし')).toBeInTheDocument();
  });

  it('ReactNodeとして値が表示される', () => {
    const data = [
      {
        label: 'ポイント',
        value: <span data-testid="point-value">1,000 pt</span>,
      },
    ];

    render(<InfoTable data={data} />);

    expect(screen.getByText('ポイント')).toBeInTheDocument();
    expect(screen.getByTestId('point-value')).toBeInTheDocument();
    expect(screen.getByText('1,000 pt')).toBeInTheDocument();
  });

  it('空のデータで正しくレンダリングされる', () => {
    const { container } = render(<InfoTable data={[]} />);

    // コンテナは存在するがデータ行はない
    const dataRows = container.querySelectorAll('p');
    expect(dataRows.length).toBe(0);
  });

  it('混在したカラム数のデータが正しく表示される', () => {
    const data = [
      { label: '会社名', value: '松村商事株式会社' },
      { label: 'ユーザーコード', value: '0001' },
      { label: '販売店コード', value: '999997-00' },
    ];

    render(<InfoTable data={data} columns={2} />);

    expect(screen.getByText('会社名')).toBeInTheDocument();
    expect(screen.getByText('松村商事株式会社')).toBeInTheDocument();
    expect(screen.getByText('ユーザーコード')).toBeInTheDocument();
    expect(screen.getByText('0001')).toBeInTheDocument();
  });
});
