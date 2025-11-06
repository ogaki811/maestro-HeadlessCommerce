import type { Product, Category } from '@/types';

// 利用可能な商品画像
const productImages: string[] = [
  '8027341_l1.jpg', '8027360_l1.jpg', '8027379_l1.jpg', '8027403_l1.jpg', '8146306_l1.jpg',
  'A0173711.jpg', 'A0175461.jpg', 'A0188601.jpg', 'A0190941.jpg', 'A0192561.jpg',
  'A0195891.jpg', 'A0201691.jpg', 'A0209361.jpg', 'A0209481.jpg', 'A0210591.jpg',
  'A0216161.jpg', 'A0224811.jpg', 'A0225141.jpg', 'A0226821.jpg', 'A0249951.jpg',
  'A0251161.jpg', 'A0253151.jpg', 'A0253881.jpg', 'A0263581.jpg', 'A0263671.jpg',
  'A0264391.jpg', 'A2136151.jpg', 'A2136491.jpg', 'A2140151.jpg', 'A2146191.jpg',
  'A2193501.jpg', 'A2194751.jpg', 'A2194761.jpg', 'A2194801.jpg', 'A2200601.jpg',
  'A2201551.jpg', 'A2876211.jpg', 'A7675811.jpg', 'A7728231.jpg', 'A7740251.jpg',
  'A7754761.jpg', 'A7786001.jpg', 'A7786661.jpg', 'A7918681.jpg', 'A8280731.jpg',
  'A8281011.jpg', 'A8344841.jpg', 'A8344881.jpg', 'A8430061.jpg', 'A8430991.jpg',
  'A8432891.jpg', 'A8655981.jpg', 'A8656001.jpg', 'A8660831.jpg', 'A8665211.jpg',
  'A8681111.jpg', 'A8686841.jpg', 'A8696951.jpg', 'A8815661.jpg', 'A8859841.jpg',
  'A9018921.jpg', 'A9020981.jpg', 'A9024271.jpg', 'A9262981.jpg', 'A9687581.jpg',
  'AH85168_l1.jpg', 'AW74957_l1.jpg', 'AW75003_l1.jpg', 'AW75238_l1.jpg', 'AW75542_l1.jpg',
  'AWA4132_l1.jpg', 'cathead-0604005.jpg', 'cathead-0604009.jpg', 'cathead-0615001.jpg',
  'cathead-0905002.jpg', 'cathead-1516001.jpg', 'cathead-1602013.jpg', 'XU14820_l1.jpg'
];

// ランダムな画像を取得する関数（メイン画像）
const getRandomImage = (index: number): string => {
  const randomIndex = (index * 7 + 13) % productImages.length;
  return `/img/product/${productImages[randomIndex]}`;
};

// 商品ごとにランダムな画像配列を生成する関数
const getProductImages = (index: number): string[] => {
  const imageCount = (index % 4) + 1;
  const images: string[] = [];

  for (let i = 0; i < imageCount; i++) {
    const randomIndex = (index * 7 + 13 + i * 11) % productImages.length;
    images.push(`/img/product/${productImages[randomIndex]}`);
  }

  return images;
};

export const sampleProducts: Product[] = [
  { id: '1', name: 'A4コピー用紙 5000枚', code: 'AWA4132', price: 7990, image: getRandomImage(0), images: getProductImages(0), brand: 'プラス', category: '文具・事務用品', stock: true, rating: 4.5, tags: ['人気'] },
  { id: '2', name: 'オフィスチェア エルゴノミック', code: 'AW75238', price: 45800, image: getRandomImage(1), images: getProductImages(1), brand: 'プラス', category: '家具', stock: true, rating: 4.8, tags: ['高評価'] },
  { id: '3', name: 'ボールペン 10本セット', code: '8027341', price: 1200, image: getRandomImage(2), images: getProductImages(2), brand: 'ゼブラ', category: '文具・事務用品', stock: true, rating: 4.3, tags: [] },
  { id: '4', name: 'クリアファイル 20枚', code: 'AH85168', price: 980, image: getRandomImage(3), images: getProductImages(3), brand: 'プラス', category: '文具・事務用品', stock: true, rating: 4.2, tags: [] },
  { id: '5', name: 'デスクマット 透明', code: 'DM110BK', price: 2500, image: getRandomImage(4), images: getProductImages(4), brand: 'プラス', category: '家具', stock: false, rating: 4.0, tags: [] },
  { id: '6', name: 'シャープペンシル 0.5mm', code: 'SP05', price: 450, image: getRandomImage(5), images: getProductImages(5), brand: 'ぺんてる', category: '文具・事務用品', stock: true, rating: 4.6, tags: ['人気'] },
  { id: '7', name: 'ノート A5 5冊パック', code: 'NT5001', price: 1500, image: getRandomImage(6), images: getProductImages(6), brand: 'プラス', category: '文具・事務用品', stock: true, rating: 4.4, tags: [] },
  { id: '8', name: 'マウス ワイヤレス', code: 'MS2000', price: 2980, image: getRandomImage(7), images: getProductImages(7), brand: 'ロジクール', category: '電化製品', stock: true, rating: 4.7, tags: ['新商品', '人気'] },
  { id: '9', name: 'キーボード メカニカル', code: 'KB5500', price: 12800, image: getRandomImage(8), images: getProductImages(8), brand: 'ロジクール', category: '電化製品', stock: true, rating: 4.9, tags: ['高評価'] },
  { id: '10', name: 'デスクライト LED', code: 'DL3300', price: 5800, image: getRandomImage(9), images: getProductImages(9), brand: 'パナソニック', category: '電化製品', stock: true, rating: 4.5, tags: [] },
  { id: '11', name: 'シュレッダー 家庭用', code: 'SH1100', price: 8900, image: getRandomImage(10), images: getProductImages(10), brand: 'アイリスオーヤマ', category: '電化製品', stock: false, rating: 4.1, tags: [] },
  { id: '12', name: 'ホワイトボード 90x60cm', code: 'WB9060', price: 3500, image: getRandomImage(11), images: getProductImages(11), brand: 'プラス', category: '文具・事務用品', stock: true, rating: 4.3, tags: [] },
  { id: '13', name: 'デスク 120x60cm', code: 'DK1260', price: 18900, image: getRandomImage(12), images: getProductImages(12), brand: 'ニトリ', category: '家具', stock: true, rating: 4.4, tags: ['セール'] },
  { id: '14', name: '書類ケース A4 3段', code: 'BC3A4', price: 2200, image: getRandomImage(13), images: getProductImages(13), brand: 'アイリスオーヤマ', category: '収納用品', stock: true, rating: 4.2, tags: [] },
  { id: '15', name: 'ファイルボックス 5個セット', code: 'FB5SET', price: 1800, image: getRandomImage(14), images: getProductImages(14), brand: 'プラス', category: '収納用品', stock: true, rating: 4.6, tags: ['人気'] },
  { id: '16', name: '電卓 12桁', code: 'CL1200', price: 1200, image: getRandomImage(15), images: getProductImages(15), brand: 'カシオ', category: '電化製品', stock: true, rating: 4.5, tags: [] },
  { id: '17', name: 'ハサミ チタンコート', code: 'SC8800', price: 980, image: getRandomImage(16), images: getProductImages(16), brand: 'プラス', category: '文具・事務用品', stock: true, rating: 4.7, tags: [] },
  { id: '18', name: 'カッターナイフ', code: 'KN0500', price: 350, image: getRandomImage(17), images: getProductImages(17), brand: 'オルファ', category: '文具・事務用品', stock: true, rating: 4.3, tags: [] },
  { id: '19', name: '付箋 3色セット', code: 'FU3SET', price: 680, image: getRandomImage(18), images: getProductImages(18), brand: 'スリーエム', category: '文具・事務用品', stock: true, rating: 4.4, tags: [] },
  { id: '20', name: 'テープのり 詰替タイプ', code: 'TN2200', price: 420, image: getRandomImage(19), images: getProductImages(19), brand: 'トンボ鉛筆', category: '文具・事務用品', stock: false, rating: 4.1, tags: [] },
  { id: '21', name: 'モニターアーム', code: 'MA7700', price: 8800, image: getRandomImage(20), images: getProductImages(20), brand: 'エルゴトロン', category: '電化製品', stock: true, rating: 4.8, tags: ['高評価'] },
  { id: '22', name: 'USBハブ 4ポート', code: 'UH4000', price: 1980, image: getRandomImage(21), images: getProductImages(21), brand: 'エレコム', category: '電化製品', stock: true, rating: 4.3, tags: [] },
  { id: '23', name: 'クッション オフィス用', code: 'CS5500', price: 2800, image: getRandomImage(22), images: getProductImages(22), brand: 'ニトリ', category: '家具', stock: true, rating: 4.5, tags: [] },
  { id: '24', name: 'フットレスト', code: 'FR3300', price: 3200, image: getRandomImage(23), images: getProductImages(23), brand: 'サンワサプライ', category: '家具', stock: true, rating: 4.4, tags: [] },
  { id: '25', name: 'ペンケース 大容量', code: 'PC8800', price: 1500, image: getRandomImage(24), images: getProductImages(24), brand: 'プラス', category: '文具・事務用品', stock: true, rating: 4.6, tags: ['人気'] },
  { id: '26', name: 'マーカー 蛍光 6色', code: 'MK6600', price: 880, image: getRandomImage(25), images: getProductImages(25), brand: 'ゼブラ', category: '文具・事務用品', stock: true, rating: 4.2, tags: [] },
  { id: '27', name: '修正テープ 5mm', code: 'MT0500', price: 320, image: getRandomImage(26), images: getProductImages(26), brand: 'トンボ鉛筆', category: '文具・事務用品', stock: true, rating: 4.3, tags: [] },
  { id: '28', name: 'ラベルシール A4', code: 'LS4400', price: 950, image: getRandomImage(27), images: getProductImages(27), brand: 'エーワン', category: '文具・事務用品', stock: false, rating: 4.0, tags: [] },
  { id: '29', name: 'パンチ 2穴', code: 'PN2000', price: 1100, image: getRandomImage(28), images: getProductImages(28), brand: 'プラス', category: '文具・事務用品', stock: true, rating: 4.5, tags: [] },
  { id: '30', name: 'ステープラー 中型', code: 'ST3000', price: 1680, image: getRandomImage(29), images: getProductImages(29), brand: 'マックス', category: '文具・事務用品', stock: true, rating: 4.7, tags: ['人気'] },
];

export const categories: Category[] = ['文具・事務用品', '家具', '電化製品', '収納用品'];

export const brands: string[] = [
  'プラス', 'ゼブラ', 'ぺんてる', 'ロジクール', 'パナソニック',
  'アイリスオーヤマ', 'ニトリ', 'カシオ', 'オルファ', 'スリーエム', 'トンボ鉛筆',
  'エルゴトロン', 'エレコム', 'サンワサプライ', 'エーワン', 'マックス'
];
