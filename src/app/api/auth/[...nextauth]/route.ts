import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * NextAuth.js v4 Route Handler
 *
 * Maestro TOC Frontend Authentication
 * 設定は @/lib/auth.ts に定義
 */

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
