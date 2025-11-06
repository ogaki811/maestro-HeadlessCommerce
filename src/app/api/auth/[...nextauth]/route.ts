import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';

/**
 * NextAuth.js v5 Configuration
 *
 * Maestro TOC Frontend Authentication
 * Composer APIと連携したJWT認証
 */

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          // Composer APIにログインリクエスト
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-business-type': 'toc', // Maestro TOCは常にTOC商流
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
          }

          const data = await response.json();

          // NextAuth用のユーザーオブジェクト
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            businessType: data.user.businessType,
            points: data.user.points,
            rank: data.user.rank,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 初回ログイン時にユーザー情報をトークンに保存
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.businessType = user.businessType;
        token.points = user.points;
        token.rank = user.rank;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      // セッションにユーザー情報を含める
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          businessType: token.businessType as string,
          points: token.points as number,
          rank: token.rank as string,
        };
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // カスタムログインページ
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour (Composer APIのaccess tokenと同じ)
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
