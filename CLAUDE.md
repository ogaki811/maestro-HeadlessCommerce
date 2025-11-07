# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Maestro TOC Frontend** - a headless commerce BtoB e-commerce platform built with Next.js 15 (App Router), TypeScript, and Tailwind CSS. The project was migrated from Vite + React to Next.js for improved SEO and performance.

### System Value & Purpose（システムの価値と目的）

**BtoB E-Commerce Platform（BtoB ECプラットフォーム）**

This is a complex BtoB e-commerce system designed for business-to-business transactions with the following key characteristics:

1. **Multi-Business Type Support（マルチ商流対応）**
   - Supports multiple business models: TOC (Take-Out Commerce), Wholesale, Retail
   - Different pricing structures per business type
   - Customer segmentation by business relationship

2. **Role-Based Access Control（ロールベースアクセス制御）**
   - Complex role and permission system
   - Different user types: TOC dealers, wholesale buyers, retail customers
   - Business-specific features and pricing visibility

3. **Headless Commerce Architecture（ヘッドレスコマース設計）**
   - Frontend (Next.js) decoupled from backend (Composer API)
   - Flexible integration with multiple business systems
   - Scalable architecture for future business expansion

4. **Business Value Proposition（ビジネス価値）**
   - **For TOC Dealers**: Streamlined ordering, loyalty points, dealer-specific pricing
   - **For Wholesale Buyers**: Volume pricing, bulk ordering, company-specific catalogs
   - **For Retail Customers**: Product discovery, standard pricing, promotional campaigns
   - **For Business**: Multi-channel sales management, unified customer data, scalable infrastructure

5. **System Complexity（システムの複雑性）**
   - Multi-tenant pricing model
   - Session-based and authenticated cart management
   - Order workflow with multiple payment methods
   - Inventory management across business types
   - Customer points and loyalty program (TOC/Retail)

**Key Stack:**
- Next.js 15.5.4 (App Router)
- TypeScript 5.7.3
- Zustand 5.0.3 (state management)
- Prisma + PostgreSQL (database)
- NextAuth.js (authentication)
- react-hot-toast (notifications)

## Development Rules（開発ルール）

**IMPORTANT**: All responses to users must be in Japanese (日本語で回答すること).

### Workflow & Planning（ワークフロー・計画）

1. **Branch Development（ブランチ開発）**
   - Always create a new branch for new features or fixes
   - Branch naming: `feature/[feature-name]`, `fix/[bug-name]`, `refactor/[scope]`
   - Never commit directly to `main` or `master`

2. **Planning First（計画優先）**
   - Create a plan before starting implementation
   - **CRITICAL: Check for existing reusable components FIRST before creating new ones**
   - **CRITICAL: When creating new pages, reference existing page templates**
   - Document component reuse decisions in the plan
   - **UI/UX development requires designer review BEFORE planning phase**
   - Get user approval before proceeding with the plan
   - Use `/init` or planning documents to outline the approach

3. **Documentation（ドキュメント）**
   - Document all plans and requirements as logs
   - Keep implementation plans in project documentation
   - **All documentation must be stored in `/docs` directory**
   - Update CLAUDE.md when architectural patterns change
   - Document structure:
     - `/docs/plans/` - Implementation plans
     - `/docs/architecture/` - Architecture diagrams and decisions
     - `/docs/api/` - API documentation
     - `/docs/components/` - Component usage guides

### Component Architecture（コンポーネント設計）

4. **Atomic Design Principles（アトミックデザイン）**
   - Follow Atomic Design methodology for all components:
     - **Atoms**: `src/components/ui/` - Basic UI elements
       - Button, Input, Badge, Icon, Select, Checkbox, Loading, NumberInput
     - **Molecules**: `src/components/common/` + some `src/components/product/` - Simple component groups
       - Pagination, Modal, Breadcrumb, ProductCodeInput, ProductPreview, StepIndicator, MainBanner, SearchBar
     - **Organisms**: Complex components with business logic
       - `src/components/layout/` - Header, Footer, MobileMenu, DealerSwitchModal
       - `src/components/product/` - ProductCard, ProductGrid, FilterSidebar
       - `src/components/cart/` - CartItem, CartSummary, CouponForm
       - `src/components/checkout/` - CheckoutSummary, PaymentMethodSelector
       - `src/components/quick-order/` - QuickOrderTable, QuickOrderMultiLineForm
     - **Templates**: Page layouts with component composition (defined in route groups)
     - **Pages**: `src/app/` - Full pages with data fetching and business logic

5. **Component Reusability（コンポーネント化）**
   - **CRITICAL**: Always check for existing reusable components before creating new ones
   - Reuse existing components whenever possible to maintain consistency
   - Extract reusable logic into components whenever possible
   - Keep components small and focused on single responsibility
   - Use composition over inheritance

6. **Design System Ready（デザインシステム対応）**
   - All components must be ready for design system integration
   - Use consistent prop interfaces across similar components
   - Document component variants and usage patterns
   - Ensure components are accessible (ARIA, keyboard navigation)

### Testing & Quality（テスト・品質）

7. **Test-Driven Development（TDD）**
   - **CRITICAL**: Always write tests BEFORE implementation
   - Follow Red-Green-Refactor cycle:
     1. Write failing test (Red)
     2. Implement minimum code to pass (Green)
     3. Refactor while keeping tests green
   - Test coverage must meet threshold (60% minimum)
   - Test files location: `__tests__/` or `*.test.ts` alongside source files

8. **Testing Patterns**
   - **Unit Tests**: Test individual functions/components in isolation
   - **Integration Tests**: Test component interactions and data flow
   - **E2E Tests**: Test critical user journeys (checkout, login)
   - Run tests before committing: `npm test`

### Styling & CSS（スタイリング）

9. **Tailwind CSS First（Tailwind優先）**
   - Use Tailwind utility classes for all styling
   - Avoid custom CSS unless absolutely necessary
   - Use Tailwind's design tokens for consistency (colors, spacing, typography)
   - If custom CSS is needed, document the reason in comments

10. **BEM Methodology（BEM方法論）**
    - When custom CSS is required, use BEM naming convention
    - Example: `.product-card__title--featured`

11. **Icon Usage（アイコン使用）**
    - **CRITICAL: Never use emoji icons in UI components**
    - Use monochrome SVG icons only
    - Icons should be single-color and consistent with the design system
    - Example of allowed icons: SVG with `stroke="currentColor"` or `fill="currentColor"`
    - Example of prohibited: 💡, ⚠️, ❌, ✅, etc.

### Git & Commits（Git・コミット）

12. **Clear Commit Messages（わかりやすいコミット）**
    - Write descriptive commit messages in Japanese
    - Format: `[type] 実装内容の説明`
    - Types: `feat`, `fix`, `refactor`, `test`, `docs`, `style`, `chore`
    - Examples:
      - `feat: 商品一覧ページにフィルター機能を追加`
      - `fix: カートの在庫チェックロジックを修正`
      - `test: useCartStoreのユニットテストを追加`
      - `refactor: ProductCardコンポーネントをAtomic Design原則に従って再構成`

13. **Commit Workflow（コミットワークフロー）**
    - **CRITICAL: Document added requirements BEFORE committing**
    - **CRITICAL: Refactor code before committing (Red-Green-Refactor cycle)**
    - **CRITICAL: Always include detailed development content in commit messages**
    - **CRITICAL: Run tests BEFORE merge, not on every commit**
    - Ensure TypeScript has no errors: `npm run build`
    - Stage related changes together
    - Use Claude Code's commit tool with co-authoring
    - Documentation requirements:
      - Create or update documentation in `/docs` for new features
      - Update feature specifications when requirements change
      - Document design decisions and architectural changes
      - Include examples and usage patterns for new components
    - Commit message must include:
      - Summary of what was implemented
      - Key changes made
      - Technical details or specifications
    - Refactoring checklist:
      - Remove duplicate code
      - Improve naming clarity
      - Extract reusable functions/components
      - Optimize performance if needed
      - Ensure consistency with project patterns

14. **Testing & Merge Workflow（テスト・マージワークフロー）**
    - **CRITICAL: Tests are run BEFORE merge, not on every commit**
    - **CRITICAL: Do NOT merge to main without explicit user instruction**
    - Before merging to main branch:
      1. Run full test suite: `npm test`
      2. Run E2E tests: `npm run test:e2e`
      3. Verify build succeeds: `npm run build`
      4. Review test results and fix any failures
      5. Present test results to user
      6. **Wait for explicit user instruction to merge**
      7. Only proceed with merge if all tests pass AND user approves
    - Do NOT run tests on individual commits during development
    - Tests are a quality gate before merge, not a commit requirement
    - **Never merge automatically - always wait for user instruction**

## Development Commands

### Development
```bash
npm run dev              # Start dev server at http://localhost:3000
npm run build            # Production build
npm start                # Start production server
npm run lint             # Run ESLint
```

### Testing
```bash
npm test                 # Run Jest unit tests
npm run test:watch       # Jest in watch mode
npm run test:coverage    # Generate coverage report
npm test -- path/to/file.test.tsx  # Run single test file
npm test -- -t "test name"         # Run specific test by name pattern

npm run test:e2e         # Run Playwright E2E tests (headless)
npm run test:e2e:ui      # Playwright with UI mode
npm run test:e2e:headed  # Playwright with visible browser
cypress open             # Open Cypress UI
npm run cypress:headless # Run Cypress headlessly
```

### Database
```bash
npx prisma migrate dev   # Run migrations in dev
npx prisma generate      # Generate Prisma client
npx prisma studio        # Open Prisma Studio
```

## Architecture

### Headless Commerce Multi-Business Type System

This project supports **multiple business types** (TOC, wholesale, retail) through a headless architecture:

- **Business Type Context**: The `NEXT_PUBLIC_BUSINESS_TYPE` environment variable determines the current business context
- **Middleware**: `src/middleware.ts` injects `x-business-type` header into all requests
- **Multi-Price Model**: `ProductPrice` table stores different prices per business type
- **Customer Segmentation**: Each customer is tied to a specific `businessType`

### App Router Structure

```
src/app/
├── (marketing)/     # Public pages (products, category, campaigns)
├── (auth)/          # Authentication pages (login, signup, password reset)
├── (shop)/          # Shopping flow (cart, checkout, order-complete)
├── (protected)/     # Auth-required pages (mypage, favorites)
└── api/             # API routes (auth, cart, orders, products)
```

Route groups `(marketing)`, `(auth)`, `(shop)`, `(protected)` organize pages without affecting URLs.

### State Management with Zustand

**All stores use SSR-safe patterns** with `typeof window !== 'undefined'` checks:

- `useCartStore` - Cart items, selection, coupons, inventory validation
- `useAuthStore` - User authentication state
- `useFavoritesStore` - Favorite products
- `useDealerStore` - TOC dealer information

**Critical**: Stores use `persist` middleware with SSR-compatible storage that returns dummy storage on server-side.

### Authentication & Authorization Flow

Uses **NextAuth.js v4** with JWT strategy:

1. Login credentials sent to Composer API (`NEXT_PUBLIC_API_URL`)
2. API returns `accessToken` and `refreshToken`
3. NextAuth stores tokens in JWT session (1 hour max age)
4. Session available via `useSession()` hook
5. Protected routes wrapped in `<SessionProvider>`

### Role-Based Access Control (RBAC)（ロールベース制御）

**BtoB System Roles:**

The system implements complex role-based access control to manage different business types and user permissions:

**1. Business Type Roles（商流タイプ）**
- **TOC (Take-Out Commerce)**: Dealer users with special pricing and loyalty points
- **Wholesale**: Company buyers with volume pricing and bulk order capabilities
- **Retail**: Standard customers with regular pricing

**2. Permission Matrix（権限マトリックス）**

| Feature | TOC | Wholesale | Retail |
|---------|-----|-----------|--------|
| Standard Products | ✓ | ✓ | ✓ |
| Special Pricing | ✓ (Dealer) | ✓ (Volume) | ✗ |
| Loyalty Points | ✓ | ✗ | ✓ |
| Bulk Order | ✓ | ✓ | ✗ |
| Company Catalog | ✗ | ✓ | ✗ |
| Quick Order (Multi-line) | ✓ | ✓ | ✗ |

**3. Implementation Pattern（実装パターン）**

```typescript
// Check user's business type from session
const { data: session } = useSession();
const businessType = session?.user?.businessType;

// Conditional rendering based on role
{businessType === 'toc' && <DealerOnlyFeature />}
{businessType === 'wholesale' && <BulkOrderForm />}

// API-level authorization
const businessType = request.headers.get('x-business-type');
if (businessType !== 'wholesale') {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
}
```

**4. Data Isolation（データ分離）**

- Each customer is tied to a specific `businessType` (stored in database)
- Product prices are segmented by business type (`ProductPrice` table)
- Cart and order data includes business type context
- API middleware enforces business type header on all requests

### API Integration Pattern

All API routes follow this pattern:

```typescript
// Check business type from middleware
const businessType = request.headers.get('x-business-type') || 'toc';

// Fetch from Composer API
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
  headers: {
    'x-business-type': businessType,
  },
});
```

### Quick Order System（クイックオーダーシステム）

**Business Types**: TOC and Wholesale only

Multi-line bulk ordering system where users can enter product codes and quantities to quickly add multiple items to cart.

**Key Components**:
- `QuickOrderTable` (Organism) - Main table with multi-line input rows
- `QuickOrderRow` (Molecule) - Individual row with product code input, quantity selector, and product preview
- `QuickOrderMultiLineForm` (Organism) - Form container managing all rows and bulk add-to-cart
- `QuickOrderHelpSection` (Molecule) - Help documentation and usage instructions
- `ProductCodeInput` (Molecule) - Product code input with validation
- `NumberInput` (Atom) - Quantity input with increment/decrement buttons

**Key Features**:
- Real-time product code validation
- Stock availability checking
- Product preview on valid code entry
- Bulk add-to-cart operation
- Row management (add/remove rows)
- Error handling per row
- Responsive design (table → stacked cards on mobile)

**Implementation Pattern**:
```typescript
// Page location: src/app/quick-order/page.tsx
// Only accessible by TOC and Wholesale users

import QuickOrderTable from '@/components/quick-order/QuickOrderTable';

// Component handles:
// - Product lookup by code
// - Inventory validation
// - Batch cart operations
// - Error state management per row
```

**Testing**:
```bash
# Run Quick Order tests
npm test -- quick-order
```

## Important Technical Details

### SSR Considerations

**Always guard browser-only APIs:**

```typescript
// ❌ Wrong - causes SSR errors
const data = localStorage.getItem('key');

// ✅ Correct
if (typeof window !== 'undefined') {
  const data = localStorage.getItem('key');
}
```

**Client Components**: Use `'use client'` directive for:
- Components using `useState`, `useEffect`, browser APIs
- Swiper.js components
- All Zustand store consumers

### SEO Implementation

- **Metadata API**: Each page exports `metadata` or `generateMetadata` function
- **Dynamic Metadata**: Product pages use `generateMetadata` with product data
- **Structured Data**: JSON-LD schemas implemented for:
  - Product (product details)
  - BreadcrumbList (navigation)
  - Organization (site-wide info)
- **Sitemap**: Auto-generated at `/sitemap.ts` (36 pages)

### Image Optimization

Next.js config supports AVIF/WebP formats with responsive sizes:
- Use `next/image` `<Image />` component where possible
- Remote image patterns allow all HTTPS hosts (for development)
- Fallback to `<img>` exists in some components (migration in progress)

### Testing Strategy

- **Unit Tests**: Jest + React Testing Library (60% coverage threshold)
- **E2E Tests**: Playwright (chromium, firefox, webkit, mobile browsers)
- **Cypress**: Alternative E2E testing (legacy)
- Test configs auto-start dev server before E2E tests

## Database Schema

**Multi-tenant BtoB headless commerce schema:**

This database schema is designed for complex BtoB e-commerce with role-based pricing and multi-business type support.

### Core Tables（コアテーブル）

**Product Tables（商品関連）**
- `Product` - Master product catalog
  - `availableFor: String[]` - Which business types can access this product
  - `stock: Int` - Inventory management
- `ProductPrice` - Business type-specific pricing (1:N with Product)
  - `businessType: String` - 'toc', 'wholesale', 'retail'
  - `basePrice: Decimal` - Base price for this business type
  - `volumePrices: Json` - Volume discount tiers (for wholesale)
  - `minOrderQty: Int` - Minimum order quantity per business type

**Customer Tables（顧客関連）**
- `Customer` - Users with role-based business type
  - `businessType: String` - Customer's business relationship type
  - `dealerCode: String` - Unique for TOC dealers
  - `companyCode: String` - Unique for wholesale buyers
  - `companyName: String` - For B2B customers
  - `points: Int` - Loyalty points (TOC/Retail only)

**Cart Tables（カート関連）**
- `Cart` - Session or customer-tied carts
  - `customerId: String` - For authenticated users
  - `sessionId: String` - For guest users
  - `businessType: String` - Business context for pricing
- `CartItem` - Cart line items
  - `price: Decimal` - **Snapshot price at time of adding** (important for price changes)

**Order Tables（注文関連）**
- `Order` - Order history with complete business context
  - `businessType: String` - Business type for this order
  - `paymentMethod: String` - 'invoice', 'bank_transfer', 'credit_card'
  - `pointsUsed: Int` - Loyalty points used (TOC/Retail)
  - `pointsEarned: Int` - Loyalty points earned (TOC/Retail)
- `OrderItem` - Order line items with historical snapshots
  - `productCode: String` - **Snapshot at order time**
  - `productName: String` - **Snapshot at order time**
  - `unitPrice: Decimal` - **Historical price preservation**

### Key Design Principles（設計原則）

**1. Multi-Tenant Pricing（マルチテナント価格設定）**
- One product has multiple prices (one per business type)
- Prices are looked up based on `x-business-type` header
- Volume pricing only applies to wholesale business type

**2. Data Isolation（データ分離）**
- Customer `businessType` field enforces role-based access
- API middleware validates business type context on all requests
- Product visibility controlled by `availableFor` array

**3. Historical Data Preservation（履歴データ保持）**
- Cart items store price at time of adding (handles price changes)
- Order items snapshot all product data (preserve historical accuracy)
- Orders maintain business type context for reporting

**4. Role-Specific Features（ロール固有機能）**
- `dealerCode` only for TOC customers
- `companyCode` only for wholesale customers
- `points` field only used by TOC and retail customers
- `volumePrices` JSON field only used by wholesale pricing

## Common Patterns

### Creating a New Component (Atomic Design)

**ALWAYS follow TDD**: Write tests first, then implement.

1. **Determine Component Level**
   - Atom: Single UI element (Button, Input, Icon)
   - Molecule: Group of atoms (SearchBar, FormField)
   - Organism: Complex component (Header, ProductCard, CheckoutForm)

2. **Write Test First (Red)**
   ```bash
   # Create test file
   touch src/components/[level]/[ComponentName]/__tests__/[ComponentName].test.tsx
   ```

   ```typescript
   // Example: Button.test.tsx
   import { render, screen } from '@testing-library/react';
   import Button from '../Button';

   describe('Button', () => {
     it('renders with correct text', () => {
       render(<Button>Click me</Button>);
       expect(screen.getByText('Click me')).toBeInTheDocument();
     });
   });
   ```

3. **Implement Component (Green)**
   ```typescript
   // src/components/ui/Button/Button.tsx
   interface ButtonProps {
     children: React.ReactNode;
     variant?: 'primary' | 'secondary';
     onClick?: () => void;
   }

   export default function Button({ children, variant = 'primary', onClick }: ButtonProps) {
     return (
       <button
         className={`px-4 py-2 rounded ${variant === 'primary' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
         onClick={onClick}
       >
         {children}
       </button>
     );
   }
   ```

4. **Refactor & Document**
   - Add JSDoc comments for props
   - Export from index: `src/components/ui/Button/index.ts`
   - Update component documentation if needed

### Adding a New Page

1. **Plan & Get Approval**: Outline page structure and components needed
2. **Write E2E Test First**: Test critical user flows
3. Create page in appropriate route group: `src/app/(group)/page-name/page.tsx`
4. Export metadata for SEO
5. Use layout components: `<Header>`, `<Footer>`, `<Breadcrumb>`
6. Implement responsive design with Tailwind CSS
7. Run tests: `npm test && npm run test:e2e`

### Creating New API Routes

1. **Write API Test First**: Test expected responses and error cases
2. Add route handler: `src/app/api/resource/route.ts`
3. Extract `x-business-type` from headers (set by middleware)
4. Forward requests to Composer API with business type context
5. Handle errors and return appropriate HTTP status codes
6. Verify tests pass

### Working with Zustand Stores

1. **Write Store Tests First**: Test state updates and actions
2. Import store: `import useCartStore from '@/store/useCartStore'`
3. Use selectors for performance: `const items = useCartStore((state) => state.items)`
4. Call actions: `useCartStore.getState().addItem(product)`
5. Stores auto-persist to localStorage (SSR-safe)

### Implementing Role-Based Features（ロールベース機能の実装）

**For BtoB complex systems with role-based access:**

1. **Check User's Business Type**
   ```typescript
   import { useSession } from 'next-auth/react';

   const { data: session } = useSession();
   const businessType = session?.user?.businessType; // 'toc' | 'wholesale' | 'retail'
   ```

2. **Conditional UI Rendering**
   ```typescript
   // Show features based on business type
   {businessType === 'toc' && (
     <DealerPointsDisplay points={session.user.points} />
   )}

   {businessType === 'wholesale' && (
     <BulkOrderButton productId={product.id} />
   )}

   {['toc', 'wholesale'].includes(businessType) && (
     <QuickOrderForm />
   )}
   ```

3. **API Route Authorization**
   ```typescript
   // src/app/api/dealer-only/route.ts
   import { NextRequest, NextResponse } from 'next/server';

   export async function GET(request: NextRequest) {
     const businessType = request.headers.get('x-business-type');

     // Enforce business type restriction
     if (businessType !== 'toc') {
       return NextResponse.json(
         { error: 'This endpoint is only for TOC dealers' },
         { status: 403 }
       );
     }

     // Continue with authorized logic
   }
   ```

4. **Price Calculation by Business Type**
   ```typescript
   // Get correct price based on business type
   const price = product.prices.find(
     p => p.businessType === businessType
   );

   // Apply volume discount for wholesale
   if (businessType === 'wholesale' && price?.volumePrices) {
     const volumePrice = calculateVolumePrice(
       price.volumePrices,
       quantity
     );
   }
   ```

5. **Testing Role-Based Logic**
   ```typescript
   describe('DealerOnlyFeature', () => {
     it('renders for TOC users', () => {
       const mockSession = {
         user: { businessType: 'toc', points: 1000 }
       };
       render(<DealerOnlyFeature />, { session: mockSession });
       expect(screen.getByText('Dealer Points')).toBeInTheDocument();
     });

     it('does not render for retail users', () => {
       const mockSession = {
         user: { businessType: 'retail' }
       };
       render(<DealerOnlyFeature />, { session: mockSession });
       expect(screen.queryByText('Dealer Points')).not.toBeInTheDocument();
     });
   });
   ```

## Environment Variables

Required variables (create `.env.local`):

```
NEXT_PUBLIC_BUSINESS_TYPE=toc
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_ID=maestro-toc
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/maestro
```

## Performance Results

Migration from Vite + React to Next.js 15 achieved these improvements:
- **FCP**: 2.5s → 0.8s (68% improvement) ✅
- **LCP**: 3.5s → 1.2s (66% improvement) ✅
- **SEO Score**: 95-100 (from 85-90) ✅
- **First Load JS**: 130-137 kB for main pages ✅
- **Static Pages**: 16 pages pre-rendered at build time
- **TypeScript Errors**: 0 ✅

See README.md for detailed migration history and phase completion reports.

## Key Files（重要ファイル）

### Core Architecture（コアアーキテクチャ）
- `src/middleware.ts` - Business type header injection for all requests
- `src/app/layout.tsx` - Root layout with font, toast, session provider
- `prisma/schema.prisma` - Multi-business type BtoB database schema

### Authentication & Authorization（認証・認可）
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth JWT configuration
- `src/lib/api-client.ts` - API client with business type headers
- `src/lib/frontend-context.ts` - Business type context provider

### State Management（状態管理）
- `src/store/useCartStore.ts` - Cart logic with inventory validation and business type pricing
- `src/store/useAuthStore.ts` - User authentication state
- `src/store/useFavoritesStore.ts` - Favorite products management
- `src/store/useDealerStore.ts` - TOC dealer-specific information

### Business Logic（ビジネスロジック）
- `src/lib/pricing.ts` - Price calculation by business type and volume
- `src/lib/prisma.ts` - Prisma client singleton for database access

### Testing Configuration（テスト設定）
- `jest.config.js` - Jest unit test configuration (60% coverage threshold)
- `playwright.config.ts` - E2E test configuration (multi-browser support)
- `cypress.config.ts` - Legacy E2E testing configuration

### Quick Order Feature（クイックオーダー機能）
- `src/app/quick-order/page.tsx` - Quick order page (TOC/Wholesale only)
- `src/components/quick-order/QuickOrderTable.tsx` - Multi-line order table
- `src/components/quick-order/QuickOrderRow.tsx` - Individual product entry row
- `src/components/quick-order/QuickOrderMultiLineForm.tsx` - Bulk order form container
- `src/components/common/ProductCodeInput.tsx` - Product code input with validation
- `src/components/ui/NumberInput.tsx` - Quantity input component
