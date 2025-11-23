// ユーザー型定義

// ロール型定義（RBAC - Role-Based Access Control）
export type UserRole = 'super_admin' | 'admin' | 'general';

// ロールラベル
export const UserRoleLabels: Record<UserRole, string> = {
  super_admin: 'スーパー管理者',
  admin: '管理者',
  general: '一般',
};

export interface User {
  id: string;
  email: string;
  name: string;
  nameKana?: string;
  phoneNumber?: string;
  postalCode?: string;
  prefecture?: string;
  city?: string;
  address?: string;
  building?: string;
  points?: number;
  role: UserRole; // ロール情報
  createdAt: string;
  updatedAt: string;
  // BtoB関連フィールド
  code?: string; // ユーザーコード
  dealerCode?: string; // ディーラーコード（TOC）
  companyCode?: string; // 会社コード（Wholesale）
  businessType?: 'toc' | 'wholesale' | 'retail'; // 商流タイプ
}

export interface UserProfile extends User {
  avatar?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
}

// 配送先情報
export interface ShippingAddress {
  id?: string;
  name: string;
  nameKana?: string;
  postalCode: string;
  prefecture: string;
  city: string;
  address: string;
  building?: string;
  phoneNumber: string;
  isDefault?: boolean;
}

// 認証関連
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  nameKana?: string;
  phoneNumber?: string;
  dealerCode: string;      // 販売店コード（必須）
  userCode: string;        // ユーザーコード（必須）
  agreeToTerms: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  password: string;
  confirmPassword: string;
}

// Auth Store 用
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
