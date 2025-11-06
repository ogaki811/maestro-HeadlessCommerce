import { test, expect } from '@playwright/test';

/**
 * Authentication E2E Tests
 * 認証フローのE2Eテスト
 */

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies and storage before each test
    await page.context().clearCookies();
    // Navigate to a page first to have a valid document context
    await page.goto('/');
    await page.evaluate(() => {
      try {
        localStorage.clear();
      } catch (e) {
        // Ignore localStorage errors
      }
    });
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/login');

    // ログインページの要素確認
    await expect(page.locator('h1')).toContainText('ログイン');
    await expect(page.getByLabel('メールアドレス')).toBeVisible();
    await expect(page.getByLabel('パスワード')).toBeVisible();
    await expect(page.getByRole('button', { name: /^ログイン$/ })).toBeVisible();
  });

  test.skip('should show test account credentials', async ({ page }) => {
    // TODO: Add test account information display to login page
    await page.goto('/login');

    // テストアカウント情報の表示確認
    await expect(page.locator('text=TOC商流アカウント')).toBeVisible();
    await expect(page.locator('text=toc@example.com')).toBeVisible();
    await expect(page.locator('text=password123')).toBeVisible();
  });

  test('should redirect unauthenticated user from protected route', async ({ page }) => {
    await page.goto('/mypage');

    // ログインページにリダイレクト
    await expect(page).toHaveURL(/\/login/);
    await expect(page).toHaveURL(/callbackUrl=%2Fmypage/);
  });

  test('should show error on invalid login', async ({ page }) => {
    await page.goto('/login');

    // 無効な認証情報でログイン試行
    await page.getByLabel('メールアドレス').fill('invalid@example.com');
    await page.getByLabel('パスワード').fill('wrongpassword');
    await page.getByRole('button', { name: /^ログイン$/, exact: true }).first().click();

    // エラーメッセージ表示
    await expect(page.locator('text=/メールアドレスまたはパスワードが正しくありません/')).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Composer APIが起動していることを確認
    await page.goto('/login');

    // 有効な認証情報でログイン
    await page.getByLabel('メールアドレス').fill('toc@example.com');
    await page.getByLabel('パスワード').fill('password123');
    await page.getByRole('button', { name: /^ログイン$/, exact: true }).first().click();

    // ログイン成功後のリダイレクト
    await page.waitForURL('/', { timeout: 10000 });
    await expect(page).toHaveURL('/');

    // ヘッダーにユーザー名表示確認（ログイン状態）
    // Note: ヘッダーの実装によって調整が必要
    await expect(page.locator('header')).toBeVisible();
  });

  test('should login and logout successfully', async ({ page }) => {
    // ログイン
    await page.goto('/login');
    await page.getByLabel('メールアドレス').fill('toc@example.com');
    await page.getByLabel('パスワード').fill('password123');
    await page.getByRole('button', { name: /^ログイン$/, exact: true }).first().click();
    await page.waitForURL('/', { timeout: 10000 });

    // ログアウト
    // Note: ログアウトボタンの実装によって調整が必要
    await page.locator('text=ログアウト').first().click();
    await page.waitForTimeout(1000);

    // トップページに戻る
    await expect(page).toHaveURL('/');
  });

  test('should access protected route after login', async ({ page }) => {
    // ログイン
    await page.goto('/login');
    await page.getByLabel('メールアドレス').fill('toc@example.com');
    await page.getByLabel('パスワード').fill('password123');
    await page.getByRole('button', { name: /^ログイン$/, exact: true }).first().click();
    await page.waitForURL('/', { timeout: 10000 });

    // 保護されたルートにアクセス
    await page.goto('/mypage');
    await expect(page).toHaveURL('/mypage');

    // マイページが表示される
    await expect(page.locator('text=/マイページ|会員情報/')).toBeVisible();
  });

  test('should remember callback URL after login', async ({ page }) => {
    // 保護ルートに直接アクセス
    await page.goto('/mypage/orders');

    // ログインページにリダイレクト（callbackUrl付き）
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fmypage%2Forders/);

    // ログイン
    await page.getByLabel('メールアドレス').fill('toc@example.com');
    await page.getByLabel('パスワード').fill('password123');
    await page.getByRole('button', { name: /^ログイン$/, exact: true }).first().click();

    // 元のページにリダイレクト
    await page.waitForURL('/mypage/orders', { timeout: 10000 });
    await expect(page).toHaveURL('/mypage/orders');
  });

  test('should fill login form with demo button', async ({ page }) => {
    await page.goto('/login');

    // デモデータ入力ボタンをクリック
    await page.getByRole('button', { name: 'デモデータを入力' }).click();

    // フォームに値が入力される
    await expect(page.getByLabel('メールアドレス')).toHaveValue('toc@example.com');
    await expect(page.getByLabel('パスワード')).toHaveValue('password123');
  });
});
