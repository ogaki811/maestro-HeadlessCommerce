# S3静的ホスティング対応 - モック環境設計書

## 概要

Next.jsアプリケーションをS3にデプロイし、モックデータで動作するプロトタイプとして提供するための設計書です。

### 目的
- S3にアップロードして閲覧可能な静的サイトを生成
- 最終実装はエンジニアが行うため、UI/UXのモックとして提供
- APIバックエンド、データベースなしで動作する完全なフロントエンドプロトタイプ

## 阻害要因の分析

### 1. APIルート（5個） - **重要度: 高**
S3は静的ファイルホスティングのため、Next.js APIルートは動作しません。

**影響範囲:**
- `src/app/api/products/route.ts` - 商品一覧取得
- `src/app/api/products/[id]/route.ts` - 商品詳細取得
- `src/app/api/auth/[...nextauth]/route.ts` - 認証（NextAuth.js）
- `src/app/api/cart/route.ts` - カート操作
- `src/app/api/orders/route.ts` - 注文処理

**対応方針:**
モックデータを`public/mock-api/`に配置し、クライアントサイドでfetchする方式に切り替え。

### 2. Prisma/データベース接続（26箇所） - **重要度: 高**
データベースへの接続はサーバーサイドでのみ動作するため、S3では使用不可。

**対応方針:**
モックデータをJSONファイルとして提供し、データベースアクセスをスキップ。

### 3. Next.js画像最適化 - **重要度: 中**
Next.jsの画像最適化機能（Image Optimization API）はサーバーサイド処理が必要。

**対応方針:**
`next.config.ts`で`images.unoptimized: true`を設定し、画像最適化を無効化。

### 4. SSR/ISR機能 - **重要度: 高**
Server-Side RenderingやIncremental Static Regenerationは静的エクスポートでは使用不可。

**対応方針:**
`output: 'export'`を設定し、完全静的サイト生成モードに切り替え。

## アーキテクチャ設計

### モック環境の構成

```
maestro-HeadlessCommerce/
├── public/
│   └── mock-api/              # モックAPIレスポンスデータ（NEW）
│       ├── products.json
│       ├── products/
│       │   ├── [id].json      # 各商品詳細
│       ├── cart.json
│       ├── orders.json
│       └── auth.json
│
├── src/
│   ├── mocks/                 # モックデータ生成ロジック（NEW）
│   │   ├── products.ts
│   │   ├── cart.ts
│   │   ├── orders.ts
│   │   └── index.ts
│   │
│   └── lib/
│       └── api-client.ts      # モード切り替えロジック追加（MODIFY）
│
├── .env.mock                  # モック用環境変数（NEW）
└── next.config.ts             # 静的エクスポート設定追加（MODIFY）
```

### 環境変数設計

#### `.env.mock`
```bash
# モックモード有効化
NEXT_PUBLIC_USE_MOCK_DATA=true

# 静的サイト生成モード
NEXT_PUBLIC_STATIC_EXPORT=true

# ビルドタイプ
NEXT_PUBLIC_BUILD_MODE=mock

# ビジネスタイプ（既存）
NEXT_PUBLIC_BUSINESS_TYPE=toc

# サイトID（既存）
NEXT_PUBLIC_SITE_ID=maestro-toc
```

#### `.env.local`（本番用は変更なし）
```bash
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_URL=http://localhost:4000
DATABASE_URL=postgresql://user:password@localhost:5432/maestro
```

### モックデータ構造

#### `public/mock-api/products.json`
```json
{
  "products": [
    {
      "id": "prod_001",
      "productCode": "PEN-001",
      "productName": "ジェットストリーム 0.5mm 黒",
      "category": {
        "large": "文具・事務用品",
        "medium": "筆記用具",
        "small": "ボールペン"
      },
      "price": 150,
      "stock": 500,
      "imageUrl": "/images/products/pen-001.jpg",
      "businessType": "toc"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "perPage": 20
  }
}
```

#### `public/mock-api/cart.json`
```json
{
  "items": [],
  "totalAmount": 0,
  "totalQuantity": 0
}
```

### APIクライアント改修

#### `src/lib/api-client.ts`（改修例）

```typescript
/**
 * モックモードかどうかを判定
 */
const isMockMode = () => {
  return process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
};

/**
 * 商品一覧取得
 */
export async function fetchProducts(params?: ProductQueryParams) {
  if (isMockMode()) {
    // モックデータをpublicから取得
    const response = await fetch('/mock-api/products.json');
    return response.json();
  }

  // 本番API呼び出し
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
    headers: {
      'x-business-type': process.env.NEXT_PUBLIC_BUSINESS_TYPE || 'toc',
    },
  });
  return response.json();
}
```

### next.config.ts設定

```typescript
import type { NextConfig } from "next";

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  // 静的エクスポート設定
  output: isStaticExport ? 'export' : undefined,

  // 画像最適化
  images: {
    unoptimized: isStaticExport, // モックモードでは最適化無効
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // トレイリングスラッシュ（S3互換性向上）
  trailingSlash: isStaticExport,
};

export default nextConfig;
```

## 実装手順

### Phase 1: 環境設定とモックデータ準備
1. ✅ `.env.mock`ファイル作成
2. ✅ `public/mock-api/`ディレクトリ作成
3. ✅ モックデータJSON作成
   - `products.json`
   - `cart.json`
   - `orders.json`

### Phase 2: APIクライアント改修
4. ✅ `src/lib/api-client.ts`にモード切り替えロジック追加
5. ✅ 各APIメソッドにモック対応実装

### Phase 3: Next.js設定変更
6. ✅ `next.config.ts`に静的エクスポート設定追加
7. ✅ 画像最適化無効化設定

### Phase 4: ビルドテストとドキュメント
8. ✅ 静的ビルドテスト: `NEXT_PUBLIC_STATIC_EXPORT=true npm run build`
9. ✅ S3デプロイ用ドキュメント作成（`docs/deployment/s3-deployment.md`）
10. ✅ README更新

## ビルドとデプロイ

### ローカルビルド
```bash
# モックモードでビルド
cp .env.mock .env.local
npm run build

# outディレクトリが生成される（静的ファイル）
ls -la out/
```

### S3デプロイ手順
```bash
# AWS CLIでS3にアップロード
aws s3 sync out/ s3://your-bucket-name/ --delete

# CloudFrontキャッシュクリア（オプション）
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## 制限事項と注意点

### 動作しない機能
1. **認証機能** - NextAuth.jsはサーバーサイドが必要
   - モックでは認証スキップ、ログイン状態を localStorage で管理
2. **リアルタイムデータ** - データベース接続なし
   - すべてのデータは静的JSONファイル
3. **フォーム送信** - API POSTリクエスト不可
   - フォーム送信は localStorage に保存してモック動作
4. **画像最適化** - Next.js Image Optimization API 無効
   - 画像は元のサイズで配信

### モック環境での動作
- カート追加: localStorageで管理
- 注文処理: localStorage に保存（実際の送信なし）
- 商品データ: `public/mock-api/products.json`から取得

## 開発ルールへの適合

### 新しい開発ルール
> このプロジェクトはS3にアップしたら閲覧できること。
> 最終実装はエンジニアが行います。モックとして提供できるようにしたい。

### 対応状況
- ✅ S3静的ホスティング対応
- ✅ モックデータでUI/UX確認可能
- ✅ 本番環境との切り替え可能（環境変数）
- ✅ エンジニアによる実装時にモックを本番APIに置き換え可能

## 今後の拡張

### エンジニアによる本番実装時の移行手順
1. `.env.local`で`NEXT_PUBLIC_USE_MOCK_DATA=false`に設定
2. 本番APIエンドポイントを`NEXT_PUBLIC_API_URL`に設定
3. データベース接続設定（`DATABASE_URL`）
4. NextAuth.js設定（`NEXTAUTH_SECRET`, `NEXTAUTH_URL`）
5. `output: 'export'`を削除してSSRモードに戻す

### テスト戦略
- モックモード: UI/UXの動作確認、デザインレビュー
- 本番モード: 統合テスト、E2Eテスト、パフォーマンステスト

## 参考資料
- [Next.js Static Exports Documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
