import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AUTH_REDIRECT, HOME_REDIRECT } from '@/lib/constants';

interface UseAuthGuardOptions {
  requiredRole?: 'admin' | 'student';
  redirectTo?: string;
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { requiredRole, redirectTo } = options;

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push(AUTH_REDIRECT);
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      router.push(redirectTo || HOME_REDIRECT);
      return;
    }
  }, [isLoading, user, requiredRole, redirectTo, router]);

  return { user, isLoading, isAuthenticated: !!user };
}

export function useAuthGuardWithCallback(
  callback: () => void,
  options: UseAuthGuardOptions = {}
): void {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) return;
    callback();
  }, [isLoading, user, callback]);
}