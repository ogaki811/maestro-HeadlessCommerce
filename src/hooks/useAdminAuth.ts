import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';
import toast from 'react-hot-toast';

/**
 * 管理者権限のアクセスチェックを行うカスタムフック
 * @returns {boolean} hasAccess - アクセス権限があるかどうか
 */
export function useAdminAuth() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // 未認証の場合はログインページにリダイレクト
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // ロールチェック: 管理者のみアクセス可能
    if (user && (user.role === 'super_admin' || user.role === 'admin')) {
      setHasAccess(true);
    } else {
      toast.error('このページへのアクセス権限がありません');
      router.push('/mypage');
    }
  }, [isAuthenticated, user, router]);

  return hasAccess;
}
