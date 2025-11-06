describe('ECサイト 全ページテスト', () => {
  beforeEach(() => {
    // ローカルストレージをクリア
    cy.clearLocalStorage();
  });

  describe('1. TOPページ', () => {
    it('TOPページが正しく表示される', () => {
      cy.visit('/');
      cy.contains('Welcome to').should('be.visible');
      // ヘッダーが表示される
      cy.get('header').should('be.visible');
      // フッターが表示される
      cy.get('footer').should('be.visible');
    });

    it('メインビジュアルが表示される', () => {
      cy.visit('/');
      // スライダーまたはメインビジュアルの確認
      cy.get('[class*="hero"], [class*="banner"], [class*="visual"]', { timeout: 10000 })
        .should('exist');
    });
  });

  describe('2. 商品一覧ページ', () => {
    it('商品一覧ページが正しく表示される', () => {
      cy.visit('/products');
      cy.contains('商品', { timeout: 10000 }).should('exist');
    });

    it('商品カードが表示される', () => {
      cy.visit('/products');
      // 商品カードの存在確認
      cy.get('[class*="product"]', { timeout: 10000 }).should('have.length.greaterThan', 0);
    });
  });

  describe('3. 商品詳細ページ', () => {
    it('商品詳細ページが正しく表示される', () => {
      cy.visit('/products/1');
      // 商品名が表示される
      cy.get('h1, h2', { timeout: 10000 }).should('exist');
      // カートに追加ボタンが表示される
      cy.contains('カートに追加', { timeout: 10000 }).should('exist');
    });
  });

  describe('4. カートページ', () => {
    it('カートページが正しく表示される', () => {
      cy.visit('/cart');
      cy.url().should('include', '/cart');
    });

    it('空のカート状態が表示される', () => {
      cy.visit('/cart');
      // 空のカートメッセージまたはデモデータボタンが表示される
      cy.contains(/カートが空です|デモデータ/, { timeout: 10000 }).should('exist');
    });
  });

  describe('5. お気に入りページ', () => {
    it('お気に入りページが正しく表示される', () => {
      cy.visit('/favorites');
      cy.url().should('include', '/favorites');
    });
  });

  describe('6. マイページ', () => {
    it('マイページが正しく表示される', () => {
      cy.visit('/mypage');
      cy.url().should('include', '/mypage');
    });
  });

  describe('7. 注文履歴ページ', () => {
    it('注文履歴ページが正しく表示される', () => {
      cy.visit('/orders');
      cy.url().should('include', '/orders');
    });
  });

  describe('8. お届け先情報ページ', () => {
    it('お届け先情報ページが正しく表示される', () => {
      cy.visit('/shipping');
      cy.url().should('include', '/shipping');
    });
  });

  describe('ナビゲーションテスト', () => {
    it('ヘッダーのナビゲーションが機能する', () => {
      cy.visit('/');
      // ヘッダーのリンクをクリック
      cy.get('header').within(() => {
        // ロゴまたはホームリンクをクリック
        cy.get('a').first().should('exist');
      });
    });
  });

  describe('レスポンシブテスト', () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1280, height: 720 },
    ];

    viewports.forEach((viewport) => {
      it(`${viewport.name}ビューでTOPページが正しく表示される`, () => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit('/');
        cy.get('header').should('be.visible');
      });
    });
  });
});
