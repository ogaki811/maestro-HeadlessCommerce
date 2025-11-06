import 'next-auth';
import 'next-auth/jwt';

/**
 * NextAuth.js Type Declarations
 * NextAuth.jsの型定義拡張
 */

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    businessType: string;
    points: number;
    rank: string;
    accessToken?: string;
    refreshToken?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      businessType: string;
      points: number;
      rank: string;
    };
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    email?: string;
    name?: string;
    businessType?: string;
    points?: number;
    rank?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}
