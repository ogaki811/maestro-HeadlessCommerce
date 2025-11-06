export interface Campaign {
  id: string;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  featured: boolean;
  category?: string;
  products?: string[]; // 関連商品ID
}

export const campaigns: Campaign[] = [
  {
    id: 'color-stationery',
    title: 'カラー文具特集',
    description: '色とりどりの文具で、あなたのデスクを華やかに。人気のカラーペンやマーカー、付箋など、豊富なカラーバリエーションでお仕事や勉強を楽しく彩ります。',
    image: '/img/mainbanner/top_bnr_color_sta01.png',
    startDate: '2025-10-01',
    endDate: '2025-12-31',
    featured: true,
    category: '文具・事務用品',
  },
  {
    id: 'special-feature',
    title: '今月の特集',
    description: '厳選されたおすすめ商品を特別価格でご提供。オフィスに必要なアイテムを揃えるチャンスです。',
    image: '/img/mainbanner/top_bnr_feature01.png',
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    featured: true,
  },
  {
    id: 'kitchen-items',
    title: 'キッチン用品フェア',
    description: 'オフィスのキッチンや休憩室に最適な商品を集めました。清潔で快適な空間づくりをサポートします。',
    image: '/img/mainbanner/top_bnr_kitchen.png',
    startDate: '2025-10-01',
    endDate: '2025-11-30',
    featured: true,
  },
  {
    id: 'sanitization',
    title: '除菌・衛生用品特集',
    description: '清潔な職場環境を維持するための除菌・衛生用品を豊富に取り揃えています。アルコール消毒液、除菌シート、マスクなど。',
    image: '/img/mainbanner/top_bnr_m_jyokin03.png',
    startDate: '2025-10-01',
    endDate: '2025-12-31',
    featured: true,
  },
  {
    id: 'tag-collection',
    title: 'タグ・ラベル特集',
    description: '整理整頓に欠かせないタグやラベル商品。在庫管理や書類整理に便利なアイテムを多数ご用意しています。',
    image: '/img/mainbanner/top_bnr_tag.png',
    startDate: '2025-10-01',
    endDate: '2025-11-30',
    featured: true,
  },
  {
    id: 'event-goods',
    title: 'イベント用品',
    description: '会社のイベントや懇親会に最適な商品を集めました。パーティーグッズから記念品まで幅広く取り揃えています。',
    image: '/img/mainbanner/top_pro_bnr_event.png',
    startDate: '2025-10-01',
    endDate: '2025-12-31',
    featured: true,
  },
  {
    id: 'transfer-stationery',
    title: '転写文具コレクション',
    description: 'おしゃれな転写シールやステッカーで、ノートや手帳をデコレーション。クリエイティブな作業をもっと楽しく。',
    image: '/img/mainbanner/top_pro_bnr_transfer_sta.png',
    startDate: '2025-10-01',
    endDate: '2025-11-30',
    featured: true,
    category: '文具・事務用品',
  },
];

export function getCampaignById(id: string): Campaign | undefined {
  return campaigns.find((campaign) => campaign.id === id);
}

export function getFeaturedCampaigns(): Campaign[] {
  return campaigns.filter((campaign) => campaign.featured);
}
