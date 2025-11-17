# MainBanner ループ最適化・ロード時間短縮計画

## 日付
2025-01-17

## 目的
1. 画像ロード時間を短縮してUXを改善
2. 無限ループを実装してシームレスな体験を提供

## 現状の問題点

### 問題1: ロード時間が長い
- 全6枚の画像ロード完了まで待機している
- 最初の2枚は`priority`だが、残り4枚は遅延ロード
- スケルトンが長時間表示される

### 問題2: 無限ループがない
- 現在`loop: false`
- 最後のスライド後、最初に戻らない
- オートプレイが停止してしまう

## Swiper公式仕様の調査結果

### デフォルト値
- `loop`: `false`
- `centeredSlides`: `false`
- `slidesPerView`: `1`
- `loopAdditionalSlides`: `0`
- `speed`: `300`

### 公式警告
- `loop + centeredSlides + slidesPerView: 'auto'`の組み合わせは互換性問題あり
- 特にスライド数が少ない場合に不安定

## 実装アプローチ

### Phase 1: ドキュメント作成
このファイル自体

### Phase 2: 画像ロード短縮

#### 変更内容
```typescript
// 変更前: 全6枚ロード完了まで待機
if (newCount >= totalImages.current) // 6
  setImagesLoaded(true);

// 変更後: 最初の2枚ロード後すぐ表示
if (newCount >= SWIPER_SETTINGS.eagerLoadCount) // 2
  setImagesLoaded(true);
```

#### タイムアウト追加
```typescript
useEffect(() => {
  // 最大1.5秒でタイムアウト
  const timeout = setTimeout(() => {
    if (!imagesLoaded) {
      setImagesLoaded(true);
    }
  }, 1500);

  return () => clearTimeout(timeout);
}, [imagesLoaded]);
```

#### 期待される効果
- ロード時間: 6枚待機 → 2枚待機（大幅短縮）
- 最悪でも1.5秒で表示保証

### Phase 3: 無限ループ有効化

#### アプローチ: Swiper公式のloop機能を使用

**採用理由:**
- Swiper標準機能でメンテナンス性が高い
- スケルトンローディングで初期化ジャンプを既に隠蔽済み
- 6枚のスライドで公式要件を満たす

#### 変更内容
```typescript
// 変更前
loop: false,

// 変更後
loop: true,
loopAdditionalSlides: 1, // 最小限の複製スライド
```

#### リスク軽減策
- スケルトンローディングで初期化を隠蔽（既存）
- `observer: true`で再計算（既存）
- `loopAdditionalSlides: 1`で最小限の複製

### Phase 4: テスト

#### テスト項目
1. ロード時間短縮の検証
   - 2枚ロード後に表示開始すること
   - タイムアウトが機能すること
2. 無限ループの検証
   - 最後のスライド後、最初のスライドに戻ること
   - オートプレイが継続すること
3. 既存テストの通過
   - 全12テストケースが成功すること

## 実装後の期待値

### ロード時間
- 現在: 全6枚ロード完了まで（数秒）
- 改善後: 最初の2枚ロード後すぐ表示（0.5〜1秒）

### ユーザー体験
- ✅ 高速な初期表示
- ✅ シームレスな無限ループ
- ✅ 初期化ジャンプなし（スケルトンで隠蔽）

## 参考資料
- Swiper公式API: https://swiperjs.com/swiper-api
- Swiper v11 loop既知の問題: https://github.com/nolimits4web/swiper/issues/7239
