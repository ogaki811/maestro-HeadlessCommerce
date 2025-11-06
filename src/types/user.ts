// ユーザー型定義

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
  createdAt: string;
  updatedAt: string;
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
