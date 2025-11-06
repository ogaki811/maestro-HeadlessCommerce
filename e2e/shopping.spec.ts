import { test, expect } from '@playwright/test';

/**
 * Shopping Flow E2E Tests
 * 商品閲覧・カート追加フローのE2Eテスト
 */

test.describe('Shopping Flow', () => {
  test('should display products on homepage', async ({ page }) => {
    await page.goto('/');

    // トップページの商品表示確認（おすすめ商品セクション）
    await expect(page.getByRole('heading', { name: 'おすすめ商品' })).toBeVisible();
  });

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/');

    // 商品一覧ページへ遷移
    await page.goto('/products');
    await expect(page).toHaveURL('/products');

    // 商品カードが表示される
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
  });

  test('should filter products by category', async ({ page }) => {
    await page.goto('/products');

    // カテゴリフィルター選択
    const categoryFilter = page.locator('text=文具・事務用品').first();
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click();
      await page.waitForTimeout(1000);

      // URLにカテゴリパラメータが含まれる
      await expect(page).toHaveURL(/category=/);
    }
  });

  test('should view product details', async ({ page }) => {
    await page.goto('/products');

    // 最初の商品カードをクリック
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    const productName = await firstProduct.locator('h3, h2').first().textContent();

    await firstProduct.click();

    // 商品詳細ページに遷移
    await expect(page).toHaveURL(/\/products\/\d+/);

    // 商品名が表示される
    if (productName) {
      await expect(page.locator(`text=${productName}`)).toBeVisible();
    }

    // カートに追加ボタンが表示される
    await expect(page.getByRole('button', { name: /カートに追加|カートへ/ })).toBeVisible();
  });

  test('should add product to cart', async ({ page }) => {
    await page.goto('/products');

    // 商品詳細ページへ
    await page.locator('[data-testid="product-card"]').first().click();
    await page.waitForURL(/\/products\/\d+/);

    // カートに追加
    await page.getByRole('button', { name: /カートに追加|カートへ/ }).click();

    // 通知またはカート数量バッジが更新される
    await expect(page.locator('text=/カートに追加しました|追加されました/')).toBeVisible({ timeout: 5000 });
  });

  test('should view cart page', async ({ page }) => {
    await page.goto('/cart');

    await expect(page).toHaveURL('/cart');
    await expect(page.locator('h1, h2').filter({ hasText: /カート|買い物かご/ })).toBeVisible();
  });

  test('should complete shopping flow without login', async ({ page }) => {
    // 商品一覧へ
    await page.goto('/products');

    // 商品詳細へ
    await page.locator('[data-testid="product-card"]').first().click();
    await page.waitForURL(/\/products\/\d+/);

    // カートに追加
    await page.getByRole('button', { name: /カートに追加|カートへ/ }).click();
    await page.waitForTimeout(1000);

    // カートページへ
    await page.goto('/cart');
    await expect(page.locator('[data-testid="cart-item"]').first()).toBeVisible();

    // 注文ボタンをクリック（認証が必要な場合はログインページへリダイレクト）
    const checkoutButton = page.getByRole('button', { name: /注文する|購入手続き|チェックアウト/ });
    if (await checkoutButton.isVisible()) {
      await checkoutButton.click();

      // ログインページまたはチェックアウトページへ
      await page.waitForURL(/\/(login|checkout)/, { timeout: 5000 });
    }
  });

  test('should search for products', async ({ page }) => {
    await page.goto('/');

    // 検索バーに入力
    const searchInput = page.getByPlaceholder(/検索|キーワード/);
    if (await searchInput.isVisible()) {
      await searchInput.fill('コピー用紙');
      await searchInput.press('Enter');

      // 検索結果ページへ
      await expect(page).toHaveURL(/\/search|q=/);
      await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1, { timeout: 5000 });
    }
  });

  test('should update product quantity in cart', async ({ page }) => {
    // カートに商品を追加
    await page.goto('/products');
    await page.locator('[data-testid="product-card"]').first().click();
    await page.waitForURL(/\/products\/\d+/);
    await page.getByRole('button', { name: /カートに追加|カートへ/ }).click();
    await page.waitForTimeout(1000);

    // カートページへ
    await page.goto('/cart');

    // 数量変更ボタンがある場合
    const increaseButton = page.locator('[data-testid="increase-quantity"]').first();
    if (await increaseButton.isVisible()) {
      const initialQty = await page.locator('[data-testid="item-quantity"]').first().textContent();

      await increaseButton.click();
      await page.waitForTimeout(500);

      const updatedQty = await page.locator('[data-testid="item-quantity"]').first().textContent();
      expect(updatedQty).not.toBe(initialQty);
    }
  });

  test('should remove product from cart', async ({ page }) => {
    // カートに商品を追加
    await page.goto('/products');
    await page.locator('[data-testid="product-card"]').first().click();
    await page.waitForURL(/\/products\/\d+/);
    await page.getByRole('button', { name: /カートに追加|カートへ/ }).click();
    await page.waitForTimeout(1000);

    // カートページへ
    await page.goto('/cart');

    // 削除ボタン
    const removeButton = page.locator('[data-testid="remove-item"]').first();
    if (await removeButton.isVisible()) {
      await removeButton.click();
      await page.waitForTimeout(500);

      // カートが空になる
      await expect(page.locator('text=/カートは空です|商品がありません/')).toBeVisible({ timeout: 3000 });
    }
  });
});
